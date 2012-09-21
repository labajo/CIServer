// main JS file

var express = require('express');
var app = express();

//Main endpoint
app.get('/', function(req, res){
  res.send('hello no world');
});

// Cigame json endpoint
//TODO: Download the jenkins cigame web. Web Scraping and present information in json.
app.get('/jenkins/cigame', function(req, res){
    res.setHeader('Location', 'http://localhost:8484');
    res.send('hello cigame');
    res.writeHead(201);
});

app.listen(8484);