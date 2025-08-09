import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ConnectWallet() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Connect to Sapphire Testnet
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        Connect your wallet to interact with the Oasis Sapphire Testnet
      </p>
      <ConnectButton />
    </div>
  );
} 