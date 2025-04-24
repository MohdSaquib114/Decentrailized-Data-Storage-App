const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer();

router.post('/upload', upload.single('file'),fileController.uploadFile);
router.post('/download', fileController.downloadEncryptedFile);
router.post('/share', fileController.storeUserToAccessList);
router.get('/:id/:fileId/:requester', fileController.hasAccess);
router.get('/access-list/:address', fileController.getUsersAccessList);
router.get('/:address', fileController.getUserFileMetadata);
router.post('/change-permission', fileController.changePermission);
router.get('/user/:address', fileController.getUserFiles);
router.get('/cid/:fileId/:requester', fileController.getFileCID);
module.exports = router;