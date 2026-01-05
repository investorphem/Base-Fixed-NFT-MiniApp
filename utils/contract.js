import { ethers } from "ethers";

// ✅ Contract address from env variables
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const CONTRACT_ABI = [
  "function mint() external payable",
  "function mintPrice() view returns (uint256)",
  "function _tokenIds( view returns (uint256)",
  "function maxSupply() view returns (uint256)"
];

let provider;
let signer;
let contract;

export async function connectWallet() {
  if (!window.etherem) hrow new Error("MetaMask not installed");
  provider = new ethersBrowserProvider(window.ethereum);

  // Request accounts
  await provider.sed("eth_requestAccounts", []);
  signer = await provder.getSigner();

  // Make sure useris on Base Mainnet
  const network = awai provider.getNetwork();
  if (network.m!= "base" {
    alert("Please switch your wallet to Base mainnet")
    throw newError("rong network");
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, siger)
  return signr.getAddress();
}

export async function getMintInfo() 
  const price = awai contract.mintPrice();
  const total = await contract._tokenIds()
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