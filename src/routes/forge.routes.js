const router = require('express').Router();

const upload = require("multer")({
  dest: "./uploads"
});

const {
  getPrivateToken,
  createBucket,
  createObject,
  traslateObject
} = require('../controllers/forge.controllers');

router.get('/token', getPrivateToken)
router.post('/bucket', createBucket)
router.post('/object', upload.single("file"), createObject)
router.post('/object/traslate', traslateObject)

module.exports = router;