const express = require("express");
const { getNonce, verifySignature } = require("../controllers/authController");

const router = express.Router();

router.get("/nonce/:wallet", getNonce);
router.post("/verify", verifySignature);

module.exports = router;
