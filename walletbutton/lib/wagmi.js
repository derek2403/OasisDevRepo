import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Sapphire testnet chain
const sapphireTestnet = defineChain({
  id: 0x5aff, // 23295
  name: 'Oasis Sapphire Testnet',
  nativeCurrency: {
    name: 'TEST',
    symbol: 'TEST',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.io'],
      webSocket: ['wss://testnet.sapphire.oasis.io/ws'],
    },
    public: {
      http: ['https://testnet.sapphire.oasis.io'],
      webSocket: ['wss://testnet.sapphire.oasis.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sapphire Testnet Explorer',
      url: 'https://testnet.explorer.sapphire.oasis.dev',
    },
  },
  testnet: true,
});

const config = getDefaultConfig({
  appName: 'Wallet Button App',
  projectId: 'YOUR_PROJECT_ID', // You'll need to get this from WalletConnect Cloud
  chains: [sapphireTestnet],
  ssr: true, // Enable server-side rendering
});

export default config; 