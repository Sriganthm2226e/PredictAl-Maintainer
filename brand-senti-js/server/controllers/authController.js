// server/controllers/authController.js
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const admin = require('firebase-admin');

// Ensure Firebase Admin is initialized (singleton)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Private key may contain escaped newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

/** Register a new user */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    res.status(201).json({ token, user: { id: user._id, name, email, avatar: user.avatar, role: user.role } });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/** Manual login */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/** Google login via Firebase ID token */
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'ID token required' });
    const decoded = await admin.auth().verifyIdToken(idToken);
    // decoded contains uid, email, name, picture etc.
    const { uid, email, name, picture } = decoded;
    let user = await User.findOne({ email });
    if (!user) {
      // Auto‑register Google user
      user = new User({ name: name || 'Google User', email, password: bcrypt.hashSync('1234@dt', 10), avatar: picture });
      await user.save();
    }
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role } });
  } catch (err) {
    console.error('Google login error', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};
