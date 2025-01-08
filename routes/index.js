const express = require('express');
const router = express.Router();

const pixelController = require('../controllers/pixelController');
const artworkController = require('../controllers/artworkController');

router.get('/pixels', pixelController.getPixels);
router.post('/pixels', pixelController.insertPixels);

router.get('/artworks', artworkController.getArtworks);
router.post('/artworks', artworkController.insertArtwork);

module.exports = router;
