import { ethers } from "ethers";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
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
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
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