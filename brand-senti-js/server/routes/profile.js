// server/routes/profile.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const protect = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for avatar uploads (store in /uploads/avatars)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'avatars'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${req.user.id}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.get('/', protect, profileController.getProfile);
router.put('/', protect, profileController.updateProfile);
router.put('/password', protect, profileController.changePassword);
router.post('/avatar', protect, upload.single('avatar'), profileController.uploadAvatar);

module.exports = router;
