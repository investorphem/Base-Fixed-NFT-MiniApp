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
    alert("Please switch your wallet to Base mainnet")
    throw new Error("Wrong network");
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return signer.getAddress();
}

export async function getMintInfo() 
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