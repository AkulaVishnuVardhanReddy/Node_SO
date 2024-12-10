const express = require('express');
const multer = require('multer');
const AuthenticateToken = require('../MiddleWares/AuthenticateToken')
const { uploadFile, getAllFiles, deleteFile } = require('../Controllers/FileController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload',AuthenticateToken, upload.single('file'), uploadFile);

router.get('/',AuthenticateToken, getAllFiles);

router.delete('/:id',AuthenticateToken, deleteFile);

module.exports = router;
