# SIWE Authentication Hello World

A demonstration of Sign-In with Ethereum (SIWE) authentication on Oasis Sapphire testnet. This project includes a smart contract that allows only the owner to initialize their name and greet, with a Next.js frontend for testing.

## Features

- **SIWE Authentication**: Uses Oasis Protocol's SIWE implementation
- **Owner-only Functions**: Only the contract owner can initialize name and greet
- **Modern UI**: Clean, responsive Next.js frontend
- **Sapphire Testnet**: Deployed on Oasis Sapphire testnet

## Project Structure

```
siwe/
├── contracts/
│   └── SiweHelloWorld.sol    # Main contract with SIWE auth
├── scripts/
│   └── deploy.js             # Deployment script
├── test/
│   └── SiweHelloWorld.test.js # Contract tests
├── frontend/                 # Next.js frontend
│   ├── app/
│   │   ├── page.js          # Main page component
│   │   └── layout.js        # Root layout
│   ├── package.json
│   └── next.config.js
├── hardhat.config.js
└── package.json
```

## Smart Contract

The `SiweHelloWorld` contract implements:

- **SIWE Authentication**: Inherits from `SiweAuth` for secure authentication
- **Owner Management**: Uses OpenZeppelin's `Ownable` for access control
- **Name Initialization**: Only owner can set their name once
- **Greeting Function**: Returns "Hello {name}" for the owner

### Contract Functions

- `initializeName(string name)`: Set the owner's name (owner only)
- `greet()`: Returns greeting message (owner only)
- `getOwnerName()`: Get the owner's name (view function)
- `isNameInitialized()`: Check if name is set (view function)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
PRIVATE_KEY=your_private_key_here
```

### 3. Deploy Contract

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Sapphire testnet
npm run deploy
```

### 4. Update Frontend Configuration

After deployment, update the contract address in `frontend/app/page.js`:

```javascript
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
```

Or set it as an environment variable:

```bash
# In frontend/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

### 5. Run Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to test the application.

## Usage Flow

1. **Connect Wallet**: Connect your MetaMask wallet
2. **Sign In**: Complete SIWE authentication
3. **Initialize Name**: Set your name (owner only)
4. **Greet**: Get your personalized greeting

## Testing

### Contract Tests

```bash
npm test
```

### Frontend Testing

1. Ensure MetaMask is installed and connected to Sapphire testnet
2. Have some test tokens in your wallet
3. Follow the usage flow above

## Network Configuration

### Sapphire Testnet
- **Chain ID**: 0x5aff (23295)
- **RPC URL**: https://testnet.sapphire.oasis.io
- **Explorer**: https://testnet.explorer.sapphire.oasis.dev

### MetaMask Configuration

Add Sapphire testnet to MetaMask:

```json
{
  "chainId": "0x5aff",
  "chainName": "Oasis Sapphire Testnet",
  "rpcUrls": ["https://testnet.sapphire.oasis.io"],
  "nativeCurrency": {
    "name": "ROSE",
    "symbol": "ROSE",
    "decimals": 18
  },
  "blockExplorerUrls": ["https://testnet.explorer.sapphire.oasis.dev"]
}
```

## Security Features

- **SIWE Authentication**: Secure message signing and verification
- **Owner-only Access**: Only contract owner can modify state
- **Input Validation**: Prevents empty names and re-initialization
- **Event Logging**: Tracks important state changes

## Troubleshooting

### Common Issues

1. **Contract not found**: Ensure correct contract address in frontend
2. **Transaction failed**: Check wallet has sufficient ROSE tokens
3. **SIWE auth failed**: Ensure wallet is connected to Sapphire testnet
4. **Compilation errors**: Check Solidity version compatibility

### Getting Test Tokens

Visit the [Sapphire Testnet Faucet](https://faucet.testnet.oasis.dev/) to get test ROSE tokens.

## License

MIT License
