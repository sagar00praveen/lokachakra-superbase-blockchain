# Lokachakra Superbase Blockchain Project

This document explains how to set up and run the Lokachakra project. It includes steps for both the website component and the blockchain component.

1. Prerequisites

You need to have the following software installed on your computer:
Node.js (for running the website)
Rust (for the blockchain programming language)
Solana Tool Suite (to interact with the blockchain)
Anchor (the framework used for the Solana programs)
Phantom Wallet (browser extension to sign transactions)

2. Installation

First, open your terminal in the main folder of this project.
Run the following command to install the website dependencies:
npm install

3. Setting up the Blockchain

The blockchain code lives in a specific subfolder. You must build and deploy it before using the app.

Step A: Navigate to the blockchain folder
cd blockchain/lokachakra_verif

Step B: Build the program
anchor build

Step C: Deploy to Devnet
Make sure your Solana CLI is set to devnet.
anchor deploy

After deploying, you will get a Program ID. If this is a fresh deployment, make sure to update the Program ID in your frontend configuration files if it changed.

4. Running the Website

Once the blockchain is ready, go back to the main project folder.
cd ../..

Start the development server:
npm run dev

The terminal will show you a local address, usually http://localhost:5173. Open this in your web browser.

5. How to Use

Connect your Phantom Wallet when prompted on the website.
Ensure your wallet is set to "Devnet" in its settings.
You can now interact with the features, such as uploading documents to record proofs on the blockchain.

6. Troubleshooting

If you see an error saying "Not in workspace" when running anchor commands, it means you are in the wrong folder. Make sure you are inside "blockchain/lokachakra_verif" before running "anchor build" or "anchor deploy".

If you see an error "custom program error: 0x0", it means the document has already been verified and exists on the blockchain.
