const {User, validate} = require('../Models/User');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
require('dotenv').config();

let key = process.env.jwtPrivateKey;

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    try{
        let user = await User.findOne( { email: req.body.email } );
        if(user) return res.status(400).send('User or email has already been registered!');
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        console.log('User created!');
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']));
    } catch(err){
        console.log('There\'s an error ', err.message);
    }
});

module.exports = router;