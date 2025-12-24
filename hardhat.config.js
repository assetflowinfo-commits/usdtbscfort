// This file configures Hardhat (our development tool)
require("@nomicfoundation/hardhat-toolbox");

// Export settings for Hardhat to use
module.exports = {
  solidity: "0.8.19", // Solidity compiler version
  
  networks: {
    // LOCAL NETWORK SETTINGS
    hardhat: {
      forking: {
        // This URL lets us READ from real BSC (free, no account needed)
        url: "https://bsc.publicnode.com",
        
        // Block number to fork from (like taking a snapshot)
        blockNumber: 38744568,
        
        enabled: true // Turn on forking feature
      },
      
      // Set chain ID to BSC's ID (56) so MetaMask recognizes it
      chainId: 56,
      
      // CREATE FAKE TEST ACCOUNTS WITH FAKE BNB
      accounts: {
        // This mnemonic creates predictable test accounts
        mnemonic: "test test test test test test test test test test test junk",
        
        // Give each account 10,000 fake BNB (for testing only!)
        accountsBalance: "10000000000000000000000" // That's 10,000 BNB in wei
      }
    }
  }
};