const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {  genreSchema } = require('./Genre');
const mongoose = require('mongoose');

const Manga = mongoose.model('Manga',  new mongoose.Schema({
        title:{
            type: String,
            required: true,
            minlength: 5,
            maxlength: 100
        },
        genre:{
            type: [genreSchema],
            required: true,
        },
        description:{
            type: String,
            required: true,
            maxlength: 256
        }
    })
);

function validateInput(manga){
    const skema = Joi.object({
        title: Joi.string().min(5).required(),
        genreId: Joi.array().items(Joi.objectId().required()),
        description: Joi.string().max(256).required()
    });
    return skema.validate(manga);
}

exports.Manga = Manga;
exports.validate = validateInput;