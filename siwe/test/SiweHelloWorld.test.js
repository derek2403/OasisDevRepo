const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SiweHelloWorld", function () {
  let siweHelloWorld;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract with domain parameter
    const SiweHelloWorld = await ethers.getContractFactory("SiweHelloWorld");
    const domain = "test.oasis.dev";
    siweHelloWorld = await SiweHelloWorld.deploy(domain);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await siweHelloWorld.owner()).to.equal(owner.address);
    });

    it("Should not have name initialized initially", async function () {
      expect(await siweHelloWorld.isNameInitialized()).to.equal(false);
    });
  });

  describe("Name Initialization", function () {
    it("Should allow owner to initialize name", async function () {
      await siweHelloWorld.connect(owner).initializeName("Alice");
      expect(await siweHelloWorld.connect(owner).getOwnerName("0x")).to.equal("Alice");
      expect(await siweHelloWorld.isNameInitialized()).to.equal(true);
    });

    it("Should not allow non-owner to initialize name", async function () {
      await expect(
        siweHelloWorld.connect(addr1).initializeName("Bob")
      ).to.be.revertedWithCustomError(siweHelloWorld, "OwnableUnauthorizedAccount");
    });

    it("Should not allow empty name", async function () {
      await expect(
        siweHelloWorld.connect(owner).initializeName("")
      ).to.be.revertedWith("Name cannot be empty");
    });

    it("Should not allow re-initialization", async function () {
      await siweHelloWorld.connect(owner).initializeName("Alice");
      await expect(
        siweHelloWorld.connect(owner).initializeName("Bob")
      ).to.be.revertedWith("Name already initialized");
    });
  });

  describe("Greeting", function () {
    it("Should return correct greeting for owner", async function () {
      await siweHelloWorld.connect(owner).initializeName("Alice");
      expect(await siweHelloWorld.connect(owner).greet("0x")).to.equal("Hello Alice");
    });

    it("Should not allow non-owner to greet", async function () {
      await siweHelloWorld.connect(owner).initializeName("Alice");
      await expect(
        siweHelloWorld.connect(addr1).greet("0x")
      ).to.be.revertedWithCustomError(siweHelloWorld, "OwnableUnauthorizedAccount");
    });

    it("Should not allow greeting before name initialization", async function () {
      await expect(
        siweHelloWorld.connect(owner).greet("0x")
      ).to.be.revertedWith("Name not initialized yet");
    });
  });

  describe("Events", function () {
    it("Should emit NameInitialized event", async function () {
      await expect(siweHelloWorld.connect(owner).initializeName("Alice"))
        .to.emit(siweHelloWorld, "NameInitialized")
        .withArgs(owner.address);
    });
  });

  describe("Confidentiality", function () {
    it("Should provide confidentiality info", async function () {
      const infoBefore = await siweHelloWorld.getConfidentialityInfo();
      expect(infoBefore).to.equal("No name has been initialized yet");
      
      await siweHelloWorld.connect(owner).initializeName("Alice");
      const infoAfter = await siweHelloWorld.getConfidentialityInfo();
      expect(infoAfter).to.equal("Name is stored confidentially and only accessible to the owner");
    });

    it("Should allow owner to access name", async function () {
      await siweHelloWorld.connect(owner).initializeName("Alice");
      const ownerName = await siweHelloWorld.connect(owner).getOwnerName("0x");
      expect(ownerName).to.equal("Alice");
    });

    it("Should not allow non-owner to access name", async function () {
      await siweHelloWorld.connect(owner).initializeName("Alice");
      await expect(
        siweHelloWorld.connect(addr1).getOwnerName("0x")
      ).to.be.revertedWithCustomError(siweHelloWorld, "OwnableUnauthorizedAccount");
    });
  });
}); 