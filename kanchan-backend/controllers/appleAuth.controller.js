const appleSignin = require('apple-signin-auth');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.appleAuth = async (req, res) => {
  const { idToken } = req.body;
  try {
    const appleClaims = await appleSignin.verifyIdToken(idToken, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: true,
    });

    const email = appleClaims.email;
    // NOTE: Some Apple users may hide their email, handle accordingly.
    if (!email) return res.status(400).json({ message: 'Apple account must provide email.' });

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ 
        email, 
        role: "Sales", // default role, prompt for correct role in frontend
        authProvider: "apple",
        appleId: appleClaims.sub
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Apple authentication failed', details: err.message });
  }
};
