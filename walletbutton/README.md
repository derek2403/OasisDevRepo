#HOW TO USE THIS WALLET IN YOUR PROGRAM

## Step 1: Download Metamask

##Step 2: Connect to Sapphire Testnet

RPC HTTP endpoint: https://testnet.sapphire.oasis.io

RPC WebSockets endpoint: wss://testnet.sapphire.oasis.io/ws

Chain ID: (HEX: 0x5aff), (DECIMAL: 23295)

## Step 3: Find the important files and import in your Next.JS App

components/ConnectWallet.js (THIS IS THE BUTTON)

components/Providers.js (THIS IS THE PROVIDER WRAPPER)

lib/wagmi.js (WALLET CONFIGURATION)

pages/_app.js (NEXTJS WRAPPER)