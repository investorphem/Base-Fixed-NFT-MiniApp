import { useState, useEffect } from "react";
import { connectWallet, mintNFT, bulkMintNFT, getMintInfo, getBulkMintLimits, estimateBulkMintGas } from "../utils/contract";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [mintPrice, setMintPrice] = useState(null);
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [bulkLimits, setBulkLimits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(1);
  const [gasEstimate, setGasEstimate] = useState(null);
  const [mintMode, setMintMode] = useState('single'); // 'single' or 'bulk'
  const [lastMintResult, setLastMintResult] = useState(null);

  useEffect(() => {
    if (wallet) {
      fetchMintInfo();
      fetchBulkLimits();
    }
  }, [wallet]);

  useEffect(() => {
    if (mintMode === 'bulk' && bulkQuantity > 1) {
      estimateGas();
    }
  }, [bulkQuantity, mintMode]);

  async function fetchMintInfo() {
    const info = await getMintInfo();
    setMintPrice(info.mintPrice);
    setTotalMinted(info.totalMinted);
    setMaxSupply(info.maxSupply);
  }

  async function fetchBulkLimits() {
    const limits = await getBulkMintLimits();
    setBulkLimits(limits);
  }

  async function estimateGas() {
    try {
      const estimate = await estimateBulkMintGas(bulkQuantity);
      setGasEstimate(estimate);
    } catch (error) {
      console.error("Gas estimation failed:", error);
      setGasEstimate(null);
    }
  }

  async function handleConnect() {
    const account = await connectWallet();
    setWallet(account);
  }

  async function handleMint() {
    setLoading(true);
    try {
      if (mintMode === 'single') {
        await mintNFT();
        setLastMintResult({ type: 'single', quantity: 1 });
      } else {
        const result = await bulkMintNFT(bulkQuantity);
        setLastMintResult({ type: 'bulk', ...result });
      }
      await fetchMintInfo();
      await fetchBulkLimits();
    } catch (error) {
      alert(`Minting failed: ${error.message}`);
    }
    setLoading(false);
  }

  function calculateTotalCost() {
    if (!mintPrice) return 0;
    return (parseFloat(mintPrice) * bulkQuantity).toFixed(6);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold text-center">Base Fixed NFT MiniApp</h1>
          <p className="text-center text-blue-100 mt-2">Bulk Minting Enabled</p>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {!wallet ? (
            <div className="text-center">
              <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Connect Wallet
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Connect MetaMask or WalletConnect to get started
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wallet Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Connected Wallet</p>
                <p className="font-mono text-sm break-all">{wallet}</p>
              </div>

              {/* Mint Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {totalMinted}/{maxSupply}
                  </p>
                  <p className="text-sm text-gray-600">Minted</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-green-600">
                    {mintPrice ? `${mintPrice} ETH` : "Loading..."}
                  </p>
                  <p className="text-sm text-gray-600">Mint Price</p>
                </div>
              </div>

              {/* Mint Mode Toggle */}
              <div className="flex rounded-lg overflow-hidden border">
                <button
                  onClick={() => setMintMode('single')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    mintMode === 'single'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Single Mint
                </button>
                <button
                  onClick={() => setMintMode('bulk')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    mintMode === 'bulk'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Bulk Mint
                </button>
              </div>

              {/* Bulk Quantity Selector */}
              {mintMode === 'bulk' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Quantity: {bulkQuantity}
                    </label>
                    <span className="text-xs text-gray-500">
                      Max: {bulkLimits?.maxPerTransaction || 10}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={bulkLimits?.maxPerTransaction || 10}
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>{bulkLimits?.maxPerTransaction || 10}</span>
                  </div>
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Unit Price:</span>
                  <span>{mintPrice ? `${mintPrice} ETH` : "Loading..."}</span>
                </div>
                {mintMode === 'bulk' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Quantity:</span>
                      <span>{bulkQuantity}</span>
                    </div>
                    <hr className="border-gray-200" />
                  </>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Total Cost:</span>
                  <span>{mintMode === 'single' ? mintPrice : calculateTotalCost()} ETH</span>
                </div>
                {gasEstimate && mintMode === 'bulk' && (
                  <div className="text-xs text-gray-600 pt-2 border-t">
                    <p>Est. Gas Cost: {gasEstimate.estimatedCost} ETH</p>
                    <p>Total Gas: {gasEstimate.totalGas}</p>
                  </div>
                )}
              </div>

              {/* Last Mint Result */}
              {lastMintResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    ✅ Successfully minted {lastMintResult.totalMinted || 1} NFT{lastMintResult.totalMinted > 1 ? 's' : ''}!
                    {lastMintResult.totalCost && (
                      <span> Total: {lastMintResult.totalCost} ETH</span>
                    )}
                  </p>
                </div>
              )}

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={loading || !mintPrice}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  mintMode === 'single'
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
                    : 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {mintMode === 'single' ? 'Minting...' : `Bulk Minting ${bulkQuantity} NFTs...`}
                  </span>
                ) : (
                  `${mintMode === 'single' ? 'Mint' : 'Bulk Mint'} NFT${mintMode === 'bulk' && bulkQuantity > 1 ? 's' : ''}`
                )}
              </button>

              {/* Bulk Mode Info */}
              {mintMode === 'bulk' && bulkLimits && (
                <div className="text-xs text-gray-600 text-center space-y-1">
                  <p>💡 Bulk minting saves gas per NFT compared to individual mints</p>
                  <p>📊 Available: {bulkLimits.availableSupply} NFTs</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-600">
            Built for Base Chain • Gas-efficient bulk minting
          </p>
        </div>
      </div>
    </div>
  );
}
