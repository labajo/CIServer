// main JS file


//3rd dependencies
// Express MVC Framework
var express = require('express');
var app = express();

//nconf engine for reading json configurations. Support Redis.
var nconf = require('nconf');
nconf.file({ file: './configuration/conf.json' });
// Default values if config fails.
nconf.defaults({
        'httpPort': 8282
});

// winston logging engine.
var winston = require('winston');


//read local files
var fs = require('fs');


// local dependencies
var cigameService = require('./services/cigameservice.js');
cigameService.setConfigEngine(nconf);
cigameService.setLoggingEngine(winston);


//Main endpoint
app.get('/:name', function(req, res){
  var name = req.params.name;
  if(name=='favicon.ico'){
      return;
  }
  winston.info('Main endpoind. Name: ' + name);
  cigameService.getCIGameInfo(name, res);
});

// Cigame json endpoint
//TODO: Download the jenkins cigame web. Web Scraping and present information in json.
app.get('/jenkins/cigame', function(req, res){
    res.statusCode = 201;
    res.setHeader('Location', 'http://localhost:8484');
    res.send('hello cigame');
    
});


//swagger documentations.
app.get('/api/cigame.json', function(req, res){
    fs.readFile('./doc/cigame.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      res.send(200,data);
    });
});

app.listen(nconf.get('httpPort'));