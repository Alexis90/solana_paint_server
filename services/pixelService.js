const postgres = require('../pg/postgres');

exports.getPixels = async () => {
  const query = postgres('pixel_state').select({
    id: 'id',
    x: 'x',
    y: 'y',
    createdAt: 'created_at',
    walletAddress: 'wallet_address',
  });
  return query;
};

exports.insertPixels = async (data) => {
  return postgres('pixel_state').insert({
    'x': data.x,
    'y': data.y,
    'color': data.color,
    'wallet_address': data.walletAddress
  }).returning('id');
};
