const {User} = require('../Models/User');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    try{
        let user = await User.findOne( { email: req.body.email } );
        if(!user) return res.status(400).send('Invalid email or password!');
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send('Invalid email or password!');
        const token = user.generateAuthToken();
        res.send(token);
    } catch(err){
        console.log('There\'s an error ', err.message);
    }
});

function validate(req) {
    const skema = Joi.object({ //validation schema
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return skema.validate(req);
  }

module.exports = router;