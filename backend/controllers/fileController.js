const multer = require("multer");
const fs = require("fs");
const { PinataSDK } = require("pinata")


const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL
  })
  
const upload = multer({ dest: "uploads/" });

exports.upload = [upload.single("file"), async (req, res) => {
    try {
        const file = fs.createReadStream(req.file.path);
        const pinataResponse = await pinata.pinFileToIPFS(file);
        fs.unlinkSync(req.file.path);

        res.json({ message: "File uploaded to IPFS!", cid: pinataResponse.IpfsHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}];

exports.getFile = async (req, res) => {
    try {
        const cid = req.params.cid;
        const fileUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
        res.json({ fileUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
