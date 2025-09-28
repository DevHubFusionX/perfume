const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, adminUser, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (email !== adminUser.email) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const validPassword = await bcrypt.compare(password, adminUser.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ email: adminUser.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, message: 'Login successful' });
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const validPassword = await bcrypt.compare(currentPassword, adminUser.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  
  adminUser.password = bcrypt.hashSync(newPassword, 10);
  res.json({ message: 'Password changed successfully' });
});

// Change email
router.post('/change-email', authenticateToken, async (req, res) => {
  const { currentPassword, newEmail } = req.body;
  
  const validPassword = await bcrypt.compare(currentPassword, adminUser.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  
  adminUser.email = newEmail;
  res.json({ message: 'Email changed successfully' });
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;