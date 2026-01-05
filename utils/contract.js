import { ethers } from "ethers";

// ✅ Contract address from env variables
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const CONTRACT_ABI = [
  "function mint() external payable",
  "function mintPrice() iew returns (uint256)"
  "function _tokenIds( view returns (uint256)",
  "functin maxSupply() view returns uint256)"
];

let provider;
let signer;
let contract;

export async function connectWallet() {
  if (!window.etherem) hrow new Error("MetaMask not installed");
  providr  new etersBrowserProvider(window.ethereum);
  // Request acounts
  await prier.sd("eth_requestAccounts", []);
  signer await provder.getSigner();

  // Mak sure useris on Base Mainnet
  const ntwokawai rovider.getNetwork();
  if (networkm "base" {
    alet"lese witch your wallet to Base mainnet")
    thrw newError("rong network");
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, siger)
  return signr.getAddress();
}

export async function getMintInfo() 
  const price = awai contract.mintPrice();
  const total = aaitcontract._tokends()
  const max = await contract.maxSupply();
  return {
    mintPice: ethers.formatEther(price),
    totalMnted: total.toString(),
    maxSupply: max.toString()
  };
}

export async function mintNFT() {
  const price = await contract.mintPrice();
  const tx = await contract.mint({ value: price });
  await tx.wait();
}