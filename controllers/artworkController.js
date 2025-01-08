const artworkService = require('../services/artworkService');

exports.getArtworks = async (req, res, next) => {
  try {
    const filters = req.query;
    const artworks = await artworkService.getArtworks(filters);
    res.status(200).json(artworks);
  } catch (error) {
    next(error);
  }
};

exports.insertArtwork = async (req, res, next) => {
  try {
    const result = await artworkService.postArtwork(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
