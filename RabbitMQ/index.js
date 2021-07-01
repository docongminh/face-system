const express = require('express');
const bodyParser = require('body-parser');
const rabbitMQ = require('./services/rabbitmqService')
const dbconnection = require('./utils/db')
app = express()
const api_version = '/api/v1';
const port = 5000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: "100mb"}));
app.use(`${api_version}/hello`, require('./routers/helloworld'));
app.use(`${api_version}/extract`, require('./routers/embeddingRouter'));
app.listen(port, () => {
    console.log(`Listing at: ${port}`);
});

dbconnection.connectDB();
rabbitMQ.connect();
