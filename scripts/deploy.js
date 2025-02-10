const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Use the existing receiver address
  const RECEIVER_ADDRESS = "0xA17c98A79470a8A5eF9C46c04104fb75D456b98c";
  console.log("Using receiver address:", RECEIVER_ADDRESS);

  // Deploy new Sender contract
  const Sender = await ethers.getContractFactory("Sender");
  const sender = await Sender.deploy(RECEIVER_ADDRESS);
  await sender.waitForDeployment();

  const contractAddress = await sender.getAddress();
  console.log("New Sender Contract deployed to:", contractAddress);
  
  // Verify the receiver address
  const configuredReceiver = await sender.receiver();
  console.log("Configured receiver address:", configuredReceiver);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
