const express = require ('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');

const userRoute = require('./routes/users')
const carRoute = require('./routes/cars');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//request handlers
app.use('/users', userRoute)
app.use('/cars', carRoute)




//error handlers
app.use((req,res, next) => {
    const error = new Error('The URL doesn\'t exist yet');
    error.status = 404;
    next(error);

});

app.use((error,req, res,next) =>{
    res.status(error.status || 500);
    res.json({
        status: error.status || 500,
       error:{ message: error.message}
    });
    console.log(error)
});
module.exports = app;