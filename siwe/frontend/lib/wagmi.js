import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Sapphire testnet chain
const sapphireTestnet = defineChain({
  id: 0x5aff, // 23295
  name: 'Oasis Sapphire Testnet',
  nativeCurrency: {
    name: 'ROSE',
    symbol: 'ROSE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.io'],
    },
    public: {
      http: ['https://testnet.sapphire.oasis.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sapphire Testnet Explorer',
      url: 'https://testnet.explorer.sapphire.oasis.dev',
    },
  },
});

const config = getDefaultConfig({
  appName: 'SIWE Hello World',
  projectId: 'YOUR_PROJECT_ID', // You'll need to get this from WalletConnect Cloud
  chains: [sapphireTestnet],
  ssr: true, // Enable server-side rendering
});

export default config; 