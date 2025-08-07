// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {SiweAuth} from "@oasisprotocol/sapphire-contracts/contracts/auth/SiweAuth.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SiweHelloWorld
 * @dev A simple contract that demonstrates SIWE authentication with confidential storage
 * Only the owner can initialize their name and greet
 * On Sapphire, private state variables are automatically encrypted
 */
contract SiweHelloWorld is SiweAuth, Ownable {
    
    // Confidential storage for the owner's name (automatically encrypted on Sapphire)
    string private _ownerName;
    bool private _nameInitialized;
    
    event NameInitialized(address indexed owner);
    event Greeting(address indexed caller, string message);
    
    constructor(string memory domain) SiweAuth(domain) Ownable(msg.sender) {}
    
    /**
     * @dev Custom modifier that checks both msg.sender and SIWE authentication
     * @param token SIWE authentication token (can be empty for transactions)
     */
    modifier onlyOwnerWithAuth(bytes memory token) {
        address authenticatedSender = msg.sender;
        
        // If msg.sender is address(0), try SIWE authentication
        if (msg.sender == address(0) && token.length > 0) {
            authenticatedSender = authMsgSender(token);
        }
        
        if (authenticatedSender != owner()) {
            revert OwnableUnauthorizedAccount(authenticatedSender);
        }
        _;
    }
    
    /**
     * @dev Initialize the owner's name - only callable by owner
     * @param name The name to set for the owner (stored confidentially)
     */
    function initializeName(string memory name) external onlyOwner {
        require(!_nameInitialized, "Name already initialized");
        require(bytes(name).length > 0, "Name cannot be empty");
        
        // Store the name confidentially (automatically encrypted on Sapphire)
        _ownerName = name;
        _nameInitialized = true;
        
        emit NameInitialized(msg.sender);
    }
    
    /**
     * @dev Greet function that returns "Hello {name}" for the owner
     * Supports both transaction calls and SIWE authenticated view calls
     * @param token SIWE authentication token (empty for transactions)
     * @return The greeting message
     */
    function greet(bytes memory token) external view onlyOwnerWithAuth(token) returns (string memory) {
        require(_nameInitialized, "Name not initialized yet");
        return string(abi.encodePacked("Hello ", _ownerName));
    }
    
    /**
     * @dev Get the owner's name - only for owner
     * @param token SIWE authentication token (empty for transactions)
     * @return The owner's name
     */
    function getOwnerName(bytes memory token) external view onlyOwnerWithAuth(token) returns (string memory) {
        if (!_nameInitialized) {
            return "";
        }
        return _ownerName;
    }
    
    /**
     * @dev Check if name is initialized
     * @return True if name is initialized
     */
    function isNameInitialized() external view returns (bool) {
        return _nameInitialized;
    }
    
    /**
     * @dev Demonstrate that the name is stored confidentially
     * This function shows that even with view access, the raw storage is protected
     * @return A message indicating the name is stored confidentially
     */
    function getConfidentialityInfo() external view returns (string memory) {
        if (_nameInitialized) {
            return "Name is stored confidentially and only accessible to the owner";
        }
        return "No name has been initialized yet";
    }
} 