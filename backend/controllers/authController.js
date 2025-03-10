const { PrismaClient } = require("@prisma/client");
const { ethers } = require("ethers");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

exports.getNonce = async (req, res) => {
    const { wallet } = req.params;

    let user = await prisma.user.findUnique({ where: { wallet } });

    if (!user) {
        user = await prisma.user.create({
            data: { wallet, nonce: Math.random().toString(36).substring(2) },
        });
    } else {
        user = await prisma.user.update({
            where: { wallet },
            data: { nonce: Math.random().toString(36).substring(2) },
        });
    }

    res.json({ nonce: user.nonce });
};

exports.verifySignature = async (req, res) => {
    const { wallet, signature } = req.body;

    const user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const recoveredAddress = ethers.verifyMessage(user.nonce, signature);
    if (recoveredAddress.toLowerCase() !== wallet.toLowerCase()) {
        return res.status(401).json({ error: "Signature verification failed" });
    }

    const token = jwt.sign({ wallet }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Authentication successful", token });
};
