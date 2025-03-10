const express = require("express");
const { upload, getFile } = require("../controllers/fileController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", verifyToken, upload);
router.get("/file/:cid", getFile);

module.exports = router;
