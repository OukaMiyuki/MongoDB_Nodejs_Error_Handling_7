const winston = require('winston');//then also do a winston import here
module.exports = function(err, req, res, next){//error middleware function
    winston.error(err.message, err);//then add winston error to stor the error message that thrown in to the error middleware
    //you can also use different type of winston log as wel as you can se bllow here
    //error = logging eror
    //warn = warning
    //info = storing information
    //verbose
    //debug
    //silly
    res.status(500).send('An error occured!');
}