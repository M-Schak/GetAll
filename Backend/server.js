var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {
    // Website that are allowed to connect: any
    res.setHeader('Access-Control-Allow-Origin', 'null');
    // Request methods that are allowed
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    // Request headers that are allowed
    res.setHeader('Access-Control-Allow-Headers', 'origin, x-requested-with, content-type, access-control-request-h');

    // Set to true to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Max-Age', "86400");

    // Pass to next layer of middleware
    next();
});

var routes = require('./api/routes/Routes');
routes(app);

app.listen(port);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

console.log('GetAll RESTful API server started on: ' + port);
