require('express-async-errors');
const winston = require('winston');
require('winston-mongodb'); //First you need to install winston-mongodb using npm
const error = require('./Middleware/error');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const auth = require('./Routes/auth');
const home = require('./Routes/home');
const manga = require('./Routes/manga');
const genre = require('./Routes/genre');
const userProfile = require('./Routes/userProfile');
const registerUser = require('./Routes/registerUser');
require('dotenv').config();

//in the previous program, we have created handle uncaught exception as you can see down here
process.on('uncaughtException', (ex) => { //caught the exception here
    console.log('An error occured during the startup!');
    winston.error(ex.message, ex);
    process.exit(1);//terminate the process
});

//but however, those line of codes only work for uncaught exception, if you have unhandled promise rejection,
//it simply wouldn't work, so, we need to create another function for unhandled promise rejection

process.on('unhandledRejection', (ex) => { //caught the exception here
    winston.error(ex.message, ex);
    process.exit(1);//terminate the process
});

//you can also store the handling error to a different logfile with separate function
winston.exceptions.handle( new winston.transports.File({  filename: 'unncaughtException.log' }) );
//however, that approach only supprt for uncaught exception, if you have unhandled rejection, that will not stored in your 
//unncaughtException.log, use this instead

//first delete the uncaught exception code (17-21)
//then create a method that using unhandled rejection, then throw it as unhandled exception, then winston exceptions (line 32) will catch it and store it to log file
// process.on('unhandledRejection', (ex) => { //caught the exception here
//     throw ex; //throw the unhandled exception
// });

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({
    db: 'mongodb://localhost/mangaApp',
    level: 'error'
}));

throw new Error('Something error during startup!'); //use this to test the uncaught exception handling

let key = process.env.jwtPrivateKey;
if(!key){
    console.error('Private Key is not defined!');
    process.exit(1);
}

const mongoDB = 'mongodb://localhost/mangaApp';
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex:true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Could not connect to MongoDB Server : ', err));

app.use(express.json());
app.use('/', home);
app.use('/api/manga', manga);
app.use('/api/genre', genre);
app.use('/api/user', userProfile);
app.use('/api/register', registerUser);
app.use('/api/auth', auth);

app.use(error); //the error middleware stored on the last
  
const port = 3000
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});