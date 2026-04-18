const express = require('express');
const router = express.Router();

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return res.json({ 
      success: true, 
      token: 'admin-token-' + Date.now(),
      user: { 
        name: 'Admin', 
        username: 'admin', 
        role: 'super_admin' 
      }
    });
  }
  
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

module.exports = router;