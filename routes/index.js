const express = require('express')
const router = express.Router()

const pixelController = require('../controllers/pixelController')

router.get('/pixels', pixelController.getPixels)

router.post('/pixels', pixelController.insertPixels)


module.exports = router