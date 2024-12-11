const postgres = require('../loaders/postgres');

exports.getHistoricalPixelUsage = (walletAddress) => {
  const query = postgres('account_state')
    .columns({
      id: 'id',
      walletAddress: 'wallet_address',
      pixelUsed: 'pixel_used',
      lastUpdated: 'last_updated',
    })
    .where('wallet_address', walletAddress)
    .first();

  return query;
};

exports.persistAccount = (walletAddress, pixelDrawn) => {
  const existing = postgres('account_state')
    .where('wallet_address', walletAddress)
    .first();

  if (existing) {
    postgres('account_state')
      .where('wallet_address', walletAddress)
      .update({
        pixel_used: existing.pixelUsed + pixelDrawn,
        last_updated: new Date(),
      });
  } else {
    postgres('account_state').insert({
      wallet_address: walletAddress,
      pixel_used: pixelDrawn,
    });
  }
};
