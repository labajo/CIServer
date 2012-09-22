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



// local dependencies
var cigameService = require('./services/cigameservice.js');
cigameService.setConfigEngine(nconf);
cigameService.setLoggingEngine(winston);


//Main endpoint
app.get('/:name', function(req, res){
  var name = req.params.name;
  winston.info('Main endpoind. Name: ' + name);
  var resp = cigameService.getCIGameInfo(name, nconf);
  res.send(resp);
});

// Cigame json endpoint
//TODO: Download the jenkins cigame web. Web Scraping and present information in json.
app.get('/jenkins/cigame', function(req, res){
    res.statusCode = 201;
    res.setHeader('Location', 'http://localhost:8484');
    res.send('hello cigame');
    
});

app.listen(nconf.get('httpPort'));