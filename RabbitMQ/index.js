const express = require('express');
const rabbitMQ = require('./services/rabbitmqService')
const dbconnection = require('./utils/db')
app = express()
const api_version = '/api/v1';
const port = 5000;
app.use(`${api_version}/hello`, require('./routers/helloworld'));

app.listen(port, () => {
    console.log(`Listing at: ${port}`);
});

dbconnection.connectDB();
rabbitMQ.connect();
