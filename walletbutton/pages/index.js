import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ConnectWallet from "@/components/ConnectWallet";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800`}
    >
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
          <ConnectWallet />
        </div>
        
        <div className="mt-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Sapphire Testnet Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect your wallet to the Oasis Sapphire Testnet - a confidential EVM compatible network. 
            Chain ID: 23295 (0x5aff)
          </p>
        </div>
        
        <div className="mt-8 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
          <a 
            href="https://testnet.explorer.sapphire.oasis.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Explorer
          </a>
          <span>•</span>
          <a 
            href="https://docs.oasis.io/dapp/sapphire/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Docs
          </a>
          <span>•</span>
          <a 
            href="https://faucet.testnet.oasis.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Faucet
          </a>
        </div>
      </main>
    </div>
  );
}
