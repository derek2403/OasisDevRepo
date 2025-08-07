const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SiweHelloWorld contract...");

  // Get the contract factory
  const SiweHelloWorld = await ethers.getContractFactory("SiweHelloWorld");
  
  // Deploy the contract with domain parameter
  const domain = "siwe-hello-world.oasis.dev"; // You can change this to your domain
  const siweHelloWorld = await SiweHelloWorld.deploy(domain);
  
  // Wait for deployment to complete
  await siweHelloWorld.waitForDeployment();
  
  const contractAddress = await siweHelloWorld.getAddress();
  
  console.log("SiweHelloWorld deployed to:", contractAddress);
  console.log("Network:", network.name);
  
  // Get the signer address correctly
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Domain:", domain);
  
  // Verify the deployment
  console.log("\nVerifying deployment...");
  const deployedContract = await ethers.getContractAt("SiweHelloWorld", contractAddress);
  const owner = await deployedContract.owner();
  console.log("Contract owner:", owner);
  
  console.log("\nDeployment successful! 🎉");
  console.log("Contract address:", contractAddress);
  console.log("You can now interact with the contract using SIWE authentication.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 