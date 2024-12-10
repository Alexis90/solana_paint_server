const pixelService = require('../services/pixelService');

exports.getPixels = async (req, res, next) => {
  try {
    const pixels = await pixelService.getPixels();
    console.log(pixels);
    res.status(200).json(pixels);
  } catch (error) {
    next(error)
  }
};

exports.insertPixels = async (req, res, next) => {
  try {
    const result = await pixelService.insertPixels(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error)
  }
};
