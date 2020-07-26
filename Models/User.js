const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
require('dotenv').config();

const key = process.env.jwtPrivateKey;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign( { _id: this._id, isAdmin: this.isAdmin }, key);
    return token;
}

const userModel = mongoose.model('user', userSchema);
var mediumRegex = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,255}$/);
function validateUser(user) {
    const skema = Joi.object({ //validation schema
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).pattern(mediumRegex).required().messages({
            "string.base": "Sorry! It looks like something went wrong. Please try later",
            "string.pattern.base": "The password should be contain atleat 1 lower and uppercase alphabetical character, 1  numeric character, 1 special  and 5 character long!",
            "string.empty": "Password should not be an empty!",
            "any.required": "Password is required"
        })
        //another way to get an error password complexity message
        // password: Joi.string().min(8).max(255).regex(RegExp(mediumRegex)).required().error(errors => {
        //   errors.forEach(err => {
        //     switch (err.type) {
        //       case "any.empty":
        //         err.message = "Value should not be empty!";
        //         break;
        //       case "string.min":
        //         err.message = `Value should have at least ${err.context.limit} characters!`;
        //         break;
        //       case "string.max":
        //         err.message = `Value should have at most ${err.context.limit} characters!`;
        //         break;
        //       default:
		    //         err.message = 'The password should be contain atleat 1 lower and uppercase alphabetical character, 1  numeric character, 1 special  and 5 character long!';
        //         break;
        //     }
        //   });
        //   return errors;
        // })
    });
    return skema.validate(user);
}
exports.User = userModel; 
exports.validate = validateUser;