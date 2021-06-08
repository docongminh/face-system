// import dependency
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');

// set up dependencies
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/api', require('./server/routes/create_router'));

// setup mongoose
const url = 'mongodb+srv://cristian:minhquan123@cluster0.zuxzb.mongodb.net/courses?retryWrites=true&w=majority';
mongoose.connect(`${url}`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => {
        console.log('Error connecting to DB', error);
    });
// set up port
const port = 5000;
//set up route
app.get('/', (request, respond) =>{
    respond.status(200).json(
        {
            message: "welcome to project example",
        }
    );
});
//
app.listen(port, (request, respond) => {
    console.log(`Our sever is live on ${port} !`);
});


