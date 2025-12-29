import { useState, useEffect } from "react";
import { connectWallet, mintNFT, getMintInfo } from "../utils/contract";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [mintPrice, setMintPrice] = useState(null);
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet) fetchMintInfo();
  }, [wallet]);

  async function fetchMintInfo() {
    const info = await getMintInfo();
    setMintPrice(info.mintPrice);
    setTotalMinted(info.totalMinted);
    setMaxSupply(info.maxSupply);
  }

  async function handleConnect() {
    const account = await connectWallet();
    setWallet(account);
  }

  async function handleMint() {
    setLoading(true);
    await mintNFT();
    await fetchMintInfo();
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Base Fixed NFT MiniApp</h1>

      {!wallet ? (
        <button
          onClick={handleConnect}
          className="bg-blue-600 text-white px-6 py-3 rounded-md"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p>Connected Wallet: {wallet}</p>
          <p>Mint Price: {mintPrice ? `${mintPrice} ETH` : "Loading..."}</p>
          <p>
            Minted: {totalMinted}/{maxSupply}
          </p>
          <button
            onClick={handleMint}
            className="bg-green-600 text-white px-6 py-3 rounded-md"
            disabled={loading}
          >
            {loading ? "Minting..." : "Mint NFT"}
          </button>
        </div>
      )}
    </div>
  );
}