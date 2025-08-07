'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { SapphireProvider } from '@oasisprotocol/sapphire-paratime';

const CONTRACT_ADDRESS = '0xf2A8094B78ebd607086F2fCd6AeBecF62BbE01f0';
const CHAIN_ID = 0x5aff; // Sapphire testnet

// Updated ABI to match the new contract functions
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "domain",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "A13e_RevokedAuthToken",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SiweAuth_AddressMismatch",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SiweAuth_ChainIdMismatch",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SiweAuth_DomainMismatch",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SiweAuth_Expired",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SiweAuth_NotBeforeInFuture",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SiweParser_InvalidAddressLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SiweParser_InvalidNonce",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "Greeting",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "NameInitialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "domain",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "token",
        "type": "bytes"
      }
    ],
    "name": "getOwnerName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "token",
        "type": "bytes"
      }
    ],
    "name": "greet",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "initializeName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isNameInitialized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "siweMsg",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "v",
            "type": "uint256"
          }
        ],
        "internalType": "struct SignatureRSV",
        "name": "sig",
        "type": "tuple"
      }
    ],
    "name": "login",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [contract, setContract] = useState(null);
  const [sapphireContract, setSapphireContract] = useState(null);
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [isNameInitialized, setIsNameInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [siweToken, setSiweToken] = useState('');
  const [contractOwner, setContractOwner] = useState('');

  useEffect(() => {
    if (isConnected && walletClient) {
      initializeContract();
    }
  }, [isConnected, walletClient]);

  const initializeContract = async () => {
    try {
      // Create ethers provider from wagmi
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(contract);

      // Create Sapphire-wrapped contract for authenticated calls
      const sapphireProvider = new SapphireProvider(provider);
      const sapphireContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setSapphireContract(sapphireContract);

      // Get contract owner
      const owner = await contract.owner();
      setContractOwner(owner);

      // Check if name is initialized
      const initialized = await contract.isNameInitialized();
      setIsNameInitialized(initialized);

      if (initialized) {
        try {
          // Try to get owner name (this will only work if user is the owner)
          const ownerName = await contract.getOwnerName("0x");
          setName(ownerName);
        } catch (error) {
          // If not owner, we can't see the name
          console.log('Cannot access owner name (not owner)');
        }
      }
    } catch (error) {
      console.error('Error initializing contract:', error);
      setError('Failed to initialize contract: ' + error.message);
    }
  };

  const signInWithEthereum = async () => {
    if (!contract || !walletClient) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create ethers provider from wagmi
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      // Get the domain from the contract
      const domain = await contract.domain();
      console.log('Contract domain:', domain);

      // Create SIWE message
      const siweMessage = new SiweMessage({
        domain,
        address,
        statement: 'Sign in to access the SiweHelloWorld contract',
        uri: window.location.origin,
        version: '1',
        chainId: CHAIN_ID,
        nonce: Math.floor(Math.random() * 1000000).toString(), // Use random nonce
      });

      // Get the message string
      const messageString = siweMessage.prepareMessage();
      console.log('SIWE Message:', messageString);

      // Sign the message
      const signature = await signer.signMessage(messageString);
      console.log('Signature:', signature);

      // Parse the signature
      const sig = ethers.Signature.from(signature);

      // Call the login function to get the SIWE token
      const token = await contract.login(messageString, {
        r: sig.r,
        s: sig.s,
        v: sig.v
      });

      console.log('SIWE Token received:', token);

      if (token && token !== '0x') {
        setSiweToken(token);
        console.log('SIWE authentication successful');
      } else {
        throw new Error('Received empty or invalid SIWE token');
      }
      
    } catch (error) {
      console.error('SIWE authentication failed:', error);
      setError('SIWE authentication failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeName = async () => {
    if (!contract || !name.trim()) {
      setError('Please enter a name');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const tx = await contract.initializeName(name);
      await tx.wait();

      setIsNameInitialized(true);
      console.log('Name initialized successfully');

    } catch (error) {
      console.error('Error initializing name:', error);
      setError('Failed to initialize name: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = async () => {
    if (!contract) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let greetingMessage;
      
      // If we have a valid SIWE token, use it for authenticated view call
      if (siweToken && siweToken !== '0x' && siweToken.length > 0) {
        console.log('Using SIWE token for authenticated call:', siweToken);
        greetingMessage = await contract.greet(siweToken);
      } else {
        // For transaction-based call (when user is owner and connected)
        console.log('Using empty token for transaction-based call');
        greetingMessage = await contract.greet("0x");
      }
      
      setGreeting(greetingMessage);
      console.log('Greeting received:', greetingMessage);

    } catch (error) {
      console.error('Error getting greeting:', error);
      setError('Failed to get greeting: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            SIWE Hello World
          </h1>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Contract:</strong> {CONTRACT_ADDRESS}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Owner:</strong> {contractOwner || 'Loading...'}
            </p>
            <p className="text-sm text-blue-800">
              <strong>You are owner:</strong> {isOwner ? '✅ Yes' : '❌ No'}
            </p>
          </div>

          <div className="mb-6">
            <ConnectButton />
          </div>

          {isConnected ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Connected Address:</p>
                <p className="text-xs text-gray-800 break-all">{address}</p>
              </div>

              <button
                onClick={signInWithEthereum}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                {loading ? 'Signing...' : 'Sign In with Ethereum'}
              </button>

              {siweToken && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">✅ SIWE Token obtained</p>
                </div>
              )}

              {isOwner && !isNameInitialized ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Initialize Your Name (Owner Only)</h3>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={initializeName}
                    disabled={loading || !name.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                  >
                    {loading ? 'Initializing...' : 'Initialize Name'}
                  </button>
                </div>
              ) : isOwner && isNameInitialized ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Greet Function (Owner Only)</h3>
                  <button
                    onClick={getGreeting}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                  >
                    {loading ? 'Loading...' : 'Get Greeting'}
                  </button>
                  {greeting && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">{greeting}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Only the contract owner can initialize name and greet. 
                    Current owner: {contractOwner || 'Loading...'}
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">Please connect your wallet to interact with the contract</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 