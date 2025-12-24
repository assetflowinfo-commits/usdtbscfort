// Load ethers library (for blockchain interaction)
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting BSC Mainnet Fork Setup...");
  console.log("======================================");
  
  // STEP 1: REAL USDT CONTRACT ADDRESS ON BSC
  // This is the ACTUAL USDT contract on Binance Smart Chain
  const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
  
  // STEP 2: REAL WHALE ADDRESS WITH LOTS OF USDT
  // This account has millions of USDT on real BSC
  // We'll "impersonate" it locally to get free test USDT
  const WHALE_ADDRESS = "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3";
  
  console.log("🔑 Impersonating USDT whale...");
  
  // STEP 3: MAGIC TRICK - BECOME THE WHALE (LOCALLY ONLY!)
  // This tells Hardhat: "Let me control this whale account temporarily"
  await ethers.provider.send("hardhat_impersonateAccount", [WHALE_ADDRESS]);
  
  console.log(`✅ Now controlling whale: ${WHALE_ADDRESS}`);
  
  // STEP 4: GET ACCESS TO WHALE'S ACCOUNT
  const whale = await ethers.getSigner(WHALE_ADDRESS);
  
  // STEP 5: USDT CONTRACT INTERFACE
  // We only need these 4 functions to interact with USDT
  const usdtAbi = [
    "function balanceOf(address) view returns (uint256)", // Check balance
    "function transfer(address to, uint256 amount) returns (bool)", // Send USDT
    "function decimals() view returns (uint8)", // Get decimal places (18 for USDT)
    "function name() view returns (string)" // Get token name
  ];
  
  // STEP 6: CONNECT TO USDT CONTRACT
  // Creates an object we can use to call USDT functions
  const usdt = new ethers.Contract(USDT_ADDRESS, usdtAbi, whale);
  
  // STEP 7: CHECK WHALE'S BALANCE
  const decimals = await usdt.decimals(); // USDT has 18 decimals
  const whaleBalance = await usdt.balanceOf(WHALE_ADDRESS);
  console.log(`💰 Whale has: ${ethers.utils.formatUnits(whaleBalance, decimals)} USDT`);
  
  // STEP 8: GET YOUR TEST ACCOUNTS
  // Hardhat automatically creates 20 test accounts from our mnemonic
  const [account1, account2, account3] = await ethers.getSigners();
  
  // ✅✅✅ THIS IS WHERE YOU PUT YOUR WALLET ADDRESS! ✅✅✅
  // Replace account1.address with YOUR wallet address:
  
  // OPTION A: Use one of Hardhat's test accounts (easier)
  const YOUR_WALLET_ADDRESS = account1.address; // Change this!
  
  // OPTION B: Use your real MetaMask address
  // const YOUR_WALLET_ADDRESS = "0xYourWalletAddressHere";
  
  console.log("\n📤 Transferring USDT to your wallet...");
  console.log(`Your wallet: ${YOUR_WALLET_ADDRESS}`);
  
  // STEP 9: TRANSFER 10,000 FAKE USDT TO YOU
  const transferAmount = ethers.utils.parseUnits("10000", decimals);
  // parseUnits("10000", 18) = 10000 * 10^18 = 10000 USDT in smallest units
  
  console.log(`Amount: 10,000 USDT`);
  
  const tx = await usdt.transfer(YOUR_WALLET_ADDRESS, transferAmount);
  await tx.wait(); // Wait for transaction to complete
  
  // STEP 10: VERIFY THE TRANSFER
  const yourBalance = await usdt.balanceOf(YOUR_WALLET_ADDRESS);
  console.log(`✅ Your USDT balance: ${ethers.utils.formatUnits(yourBalance, decimals)} USDT`);
  
  // STEP 11: CLEAN UP - STOP BEING THE WHALE
  await ethers.provider.send("hardhat_stopImpersonatingAccount", [WHALE_ADDRESS]);
  
  console.log("\n🎉 SETUP COMPLETE!");
  console.log("======================================");
  console.log("💰 You now have:");
  console.log(`- 10,000 fake BNB (from Hardhat)`);
  console.log(`- 10,000 fake USDT (from whale impersonation)`);
  console.log("\n💡 IMPORTANT: This is ALL LOCAL!");
  console.log("- No real money involved");
  console.log("- No gas fees paid");
  console.log("- Works only on your local fork");
  console.log("\n🔗 To use in MetaMask:");
  console.log("1. Network: Localhost 8545");
  console.log("2. Chain ID: 56");
  console.log(`3. Import account with private key from Hardhat`);
}

// Run the main function, catch any errors
main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});