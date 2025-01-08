const postgres = require('../loaders/postgres');

exports.getArtworks = async (filters = {}) => {
  const query = postgres('artworks').select({
    id: 'id',
    title: 'title',
    artworkData: 'artwork_data',
    author: 'author',
    createdAt: 'created_at',
  });

  if (filters && Object.keys(filters).length) {
    Object.keys(filters).forEach((key) => {
      query = query.where(key, filters[key]);
    });
  }

  return query;
};

exports.postArtwork = async (data) => {
  return postgres('artworks')
    .insert({
      title: data.title,
      artwork_data: data.artworkData,
      author: data.author,
    })
    .returning('id');
};
