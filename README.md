# Base Fixed NFT MiniApp

A mobile-friendly Farcaster miniapp for minting a fixed metadata NFT on the Base Mainnet. Users can connect their wallets, view mint information, and mint NFTs directly from the dApp.

Features
--------

- Fixed metadata NFT deployed on Base mainnet
- WalletConnect + MetaMask support for seamless wallet integration
- **Bulk Minting**: Mint up to 10 NFTs in one transaction with gas savings
- Displays mint price, total minted, and max supply dynamically
- Mobile-friendly UI using Next.js + Tailwind CSS with modern gradients
- Environment variable support for contract address and network
- Real-time gas estimation for bulk minting operations
- Easy on-chain tracking of user mint activity
- Toggle between single and bulk minting modes

Table of Contents
-----------------

1. Demo
2. Getting Started
3. Environment Variables
4. Installation
5. Running Locally
6. Deploying
7. Folder Structure
8. License

Demo
----

A mobile-friendly minting experience for your Base Fixed NFT contract:

- Connect wallet via WalletConnect or MetaMask
- View current mint price: 0.000001 ETH
- Mint your NFT directly on Base mainnet
- Track total minted vs max supply

Getting Started
---------------

Ensure you have the following installed:

- Node.js >= 18
- npm or yarn
- MetaMask or WalletConnect-enabled wallet

Environment Variables
---------------------

Create a `.env.local` file in the project root with:

NEXT_PUBLIC_CONTRACT_ADDRESS=0xCE4a10878bFa6A45345af0F6071ba81EB86c104F  
NEXT_PUBLIC_NETWORK=base

Note: NEXT_PUBLIC_ prefix is required for browser access. Allows swapping contracts or networks without modifying code.

Installation
------------

1. Clone the repository:

git clone https://github.com/your-username/farcaster-nft-miniapp.git  
cd farcaster-nft-miniapp

2. Install dependencies:

npm install  
or  
yarn install

Running Locally
---------------

Start the development server:

npm run dev  
or  
yarn dev

Open http://localhost:3000 in your browser.

Steps to mint NFT:

1. Connect wallet (MetaMask / WalletConnect)
2. Ensure wallet is on Base Mainnet
3. Click Mint NFT → confirm transaction
4. NFT will mint and total minted will update

Deploying
---------

You can deploy this miniapp to Vercel or any static hosting supporting Next.js:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:

NEXT_PUBLIC_CONTRACT_ADDRESS = 0xCE4a10878bFa6A45345af0F6071ba81EB86c104F  
NEXT_PUBLIC_NETWORK = base

4. Deploy → your miniapp is live!

Folder Structure
----------------

farcaster-nft-miniapp/  
├─ package.json  
├─ tailwind.config.js  
├─ pages/  
│  └─ index.js         # Main minting page  
├─ components/  
│  ├─ Header.js  
│  └─ MintButton.js  
├─ utils/  
│  └─ contract.js      # Wallet & contract interaction  
├─ .env.local  

License
-------

MIT License
<!-- Improved documentation -->
