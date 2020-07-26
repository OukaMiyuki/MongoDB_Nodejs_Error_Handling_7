const auth = require('../Middleware/auth');
const {User, validate} = require('../Models/User');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password'); //exclude the password
    res.send(user);
});

module.exports = router;