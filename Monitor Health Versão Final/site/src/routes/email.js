const emailController = require('../controllers/emailController');
const express = require('express');
const router = express.Router();

router.post('/sendmail', (req, res) => {
    emailController.sendMail(req, res);
})

module.exports = router;