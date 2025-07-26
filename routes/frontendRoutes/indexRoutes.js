const express = require('express');
const router = express.Router();
const Department = require('../../models/departmentsModel');


// Route for to 'index.ejs'. the main home page
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.render('index/main-layout', { page: 'pages/index', departments }); // Pass to EJS
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).send('Internal Server Error');
  }
});



// Route to get the login page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect('/dashboard'); // 👈 Redirect to dashboard if already logged in
  }
  res.render('index/pages/login'); // 👈 Otherwise, show login page
});




// 🔐 Logout route — must come first to avoid dynamic rendering issues
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Session logout failed' });
    }
    res.clearCookie('connect.sid'); // Optional: Clear session cookie
    console.log('Logged out successfully');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});




// 📄 Dynamic index pages — catch-all
router.get('/:page', (req, res) => {
  const page = req.params.page;
  res.render('index/main-layout', { page: `pages/${page}` });
});


module.exports = router;