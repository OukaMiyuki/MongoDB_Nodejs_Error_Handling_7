const auth = require('../Middleware/auth');
//const asyncMiddleWare = require('../Middleware/errorAsync');
const { Manga, validate } = require('../Models/Manga');
const { Genre } = require('../Models/Genre');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.get('/', auth, async (request, response) => {
    throw new Error('testing'); //to check the logging error create a throw exception here to test if winston logger is actually works
    // const manga = await Manga.find().sort('name');
    // response.send(manga);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    var genres = [];
    for (i in req.body.genreId){
        const genre = await Genre.findById(req.body.genreId[i]);
        if (!genre) return res.status(400).send(`Genre not found! for ${req.body.genreId[i]}`);
        genres.push({ _id: genre._id, name: genre.name }); //pushing data to genres array
    }
    
    const manga = new Manga({ 
        title: req.body.title,
        genre: genres,
        description: req.body.description
    });
        
    await manga.save();
    res.send(manga);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    var genres = [];
    for (i in req.body.genreId){
        const genre = await Genre.findById(req.body.genreId[i]);
        if (!genre) return res.status(400).send(`Genre not found! for ${req.body.genreId[i]}`);
        genres.push({ _id: genre._id, name: genre.name }); //pushing data to genres array
    }
    
    try{
        const manga = await Manga.findByIdAndUpdate(req.params.id,{ 
            title: req.body.title,
            genre: genres,
            description: req.body.description
        }, { new: true });
        if (!manga) return res.status(404).send('The manga with the given ID was not found.');
        res.send(manga);
    } catch(err){
        var a=0;
        for(i in err.errors){
            a+=1;
            console.log(a,err.errors[i].message);
        }
        console.log('Total error count : ', a);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try{
        const manga = await Manga.findByIdAndRemove(req.params.id);
        if (!manga) return res.status(404).send('The manga with the given ID was not found.');
        console.log('Data deleted!');
        res.send(manga);
    } catch(err){
        var a=0;
        for(i in err.errors){
            a+=1;
            console.log(a,err.errors[i].message);
        }
        console.log('Total error count : ', a);
    }
});

module.exports = router;