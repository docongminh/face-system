const express = require('express');
const bodyParser = require('body-parser');
const rabbitMQ = require('./rabbitmq/setup');
const dbconnection = require('./utils/db');

//
app = express();
const api_version = '/api/v1';
const port = 5000;

app.use(bodyParser.urlencoded({ extended:true }) );
app.use(bodyParser.json({limit: "100mb"}));
app.use(`${api_version}/hello`, require('./helloworld/hello_world'));
app.use(`${api_version}/face`, require('./face_services/fs_router'));
app.listen(port, () => {
    console.log(`Listing at: ${port}`);
});

dbconnection.connectDB();
rabbitMQ.connect();
