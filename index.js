const express = require('express');
const bodyParser = require('body-parser');
const rabbitMQ = require('./rabbitmq/setup');
const dbconnection = require('./utils/db');
const directExchange = require('./rabbitmq/publisher');

//
app = express();
const api_version = '/api/v1';
const port = 5000;

app.use(bodyParser.urlencoded({ extended:true }) );
app.use(bodyParser.json({limit: "100mb"}));
app.use(`${api_version}/search`, require('./face_services/fs_router'));
app.use(`${api_version}/insert`, require('./face_services/fs_router'));
app.listen(port, () => {
    console.log(`Listing at: ${port}`);
});

dbconnection.connectDB();
// rabbitMQ.connect();
directExchange.run();
