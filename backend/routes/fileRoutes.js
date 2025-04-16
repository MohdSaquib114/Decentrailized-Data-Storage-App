const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer();

router.post('/upload', upload.single('file'),fileController.uploadFile);
router.post('/grant', fileController.grantAccess);
router.get('/:address', fileController.getUserFileMetadata);
router.post('/revoke', fileController.revokeAccess);
router.get('/user/:address', fileController.getUserFiles);
router.get('/cid/:fileId/:requester', fileController.getFileCID);
module.exports = router;