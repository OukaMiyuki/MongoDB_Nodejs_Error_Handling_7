const jwt = require('jsonwebtoken');
require('dotenv').config();
let key = process.env.jwtPrivateKey;

module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied, no token provided!');

    try{
        const decoded = jwt.verify(token, key);
        req.user = decoded; //user is from user.js file where you define token as user object from userSchema, so you can basically use req.user._id for example
        next();
    } catch(ex){
        res.status(400).send('Invalid token!');
    }
}