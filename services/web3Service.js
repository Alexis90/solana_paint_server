const { Connection, PublicKey } = require('@solana/web3.js');

const SOLANA_RPC_URL =
  process.env.APP_ENV === 'development'
    ? 'https://api.devnet.solana.com'
    : 'https://api.mainnet-beta.solana.com';

const TOKEN_MINT_ADDRESS = '';

const connection = new Connection(SOLANA_RPC_URL);

exports.getTokenBalance = async (walletAddress) => {
  try {
    const publicKey = new PublicKey(walletAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        mint: new PublicKey(TOKEN_MINT_ADDRESS),
      }
    );

    const balance = tokenAccounts.value.reduce((acc, accountInfo) => {
      const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
      return acc + amount;
    }, 0);

    return balance;
  } catch (error) {
    console.log('Error fetching token balance:', error.message);
    return 0;
  }
};
