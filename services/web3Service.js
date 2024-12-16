const { Connection, PublicKey } = require('@solana/web3.js');
require('dotenv').config({ path: '../.env' });

const TOKEN_MINT_ADDRESS = process.env.TOKEN_MINT_ADDRESS;

const connection = new Connection(process.env.SOLANA_RPC_URL);

const decimals = 9;

exports.getTokenBalance = async (walletAddress) => {
  try {
    const publicKey = new PublicKey(walletAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        mint: new PublicKey(TOKEN_MINT_ADDRESS),
      }
    );

    let balance = tokenAccounts.value.reduce((acc, accountInfo) => {
      const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
      return acc + amount;
    }, 0);

    balance = Number(balance) / 10 ** decimals;

    return balance;
  } catch (error) {
    console.log('Error fetching token balance:', error.message);
    return 0;
  }
};
