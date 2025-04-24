const { registerUserOnChain, checkUserOnChain } = require('../utils/blockchain');

exports.registerUser = async (req, res) => {
  try {
    const { address } = req.body;
 
    await registerUserOnChain(address);
   
    res.json({ success:true, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.isUserRegistered = async (req, res) => {
  try {
    const { address } = req.params;
    const isRegistered = await checkUserOnChain(address);
    res.json({ registered: isRegistered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};