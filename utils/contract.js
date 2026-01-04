import { ethers } from "ethers";

// ✅ Contract address from env variables
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const CONTRACT_ABI = [
  "function mint() external payable",
  "function mintPrice() view returns (uint256)",
  "function _tokenIds() view returns (uint256)",
  "function maxSupply() view returns (uint256)"
];

let provider;
let signer;
let contract;

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  provider = new ethers.BrowserProvider(window.ethereum);

  // Request accounts
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  // Make sure user is on Base Mainnet
  const network = await provider.getNetwork();
  if (network.name !== "base") {
    alert("Please switch your wallet to Base mainnet");
    throw new Error("Wrong network");
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return signer.getAddress();
}

export async function getMintInfo() {
  const price = await contract.mintPrice();
  const total = await contract._tokenIds();
  const max = await contract.maxSupply();
  return {
    mintPrice: ethers.formatEther(price),
    totalMinted: total.toString(),
    maxSupply: max.toString()
  };
}

export async function mintNFT() {
  const price = await contract.mintPrice();
  const tx = await contract.mint({ value: price });
  await tx.wait();
}

export async function bulkMintNFT(quantity) {
  if (quantity < 1 || quantity > 10) {
    throw new Error("Quantity must be between 1 and 10");
  }

  const price = await contract.mintPrice();
  const totalPrice = price * BigInt(quantity);

  // Check if enough supply is available
  const currentSupply = await contract._tokenIds();
  const maxSupply = await contract.maxSupply();
  const available = maxSupply - currentSupply;

  if (available < quantity) {
    throw new Error(`Only ${available} NFTs available for minting`);
  }

  const txs = [];
  for (let i = 0; i < quantity; i++) {
    const tx = await contract.mint({ value: price });
    txs.push(tx);
  }

  // Wait for all transactions to complete
  await Promise.all(txs.map(tx => tx.wait()));

  return {
    totalMinted: quantity,
    totalCost: ethers.formatEther(totalPrice),
    transactions: txs.length
  };
}

export async function estimateBulkMintGas(quantity) {
  if (quantity < 1 || quantity > 10) {
    throw new Error("Quantity must be between 1 and 10");
  }

  const price = await contract.mintPrice();

  // Estimate gas for one mint transaction
  const gasEstimate = await contract.mint.estimateGas({ value: price });

  // Multiply by quantity with some overhead
  const totalGasEstimate = gasEstimate * BigInt(quantity) * BigInt(110) / BigInt(100); // 10% overhead

  return {
    gasPerMint: gasEstimate.toString(),
    totalGas: totalGasEstimate.toString(),
    estimatedCost: ethers.formatEther(totalGasEstimate * await provider.getFeeData().gasPrice)
  };
}

export async function getBulkMintLimits() {
  const maxSupply = await contract.maxSupply();
  const currentSupply = await contract._tokenIds();
  const available = maxSupply - currentSupply;

  return {
    maxPerTransaction: Math.min(10, available),
    availableSupply: available.toString(),
    maxSupply: maxSupply.toString(),
    currentSupply: currentSupply.toString()
  };
}
