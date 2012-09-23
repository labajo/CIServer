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
  winston.info('Main endpoint. Name: ' + name);
  cigameService.getCIGameInfo(name, res);
});

// Cigame json endpoint
//TODO: Download the jenkins cigame web. Web Scraping and present information in json.
app.get('/jenkins/cigame', function(req, res){
    winston.info('Cigame endpoint.');
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Content-Type", "application/json; charset=utf-8");
    res.header("X-Atmosphere-tracking-id", "af6c0948-9c64-4e63-8de9-bfcef482ae6c");
    cigameService.getCIGameInfo("Normal", res);
    //res.send('{"name": "labajo", "points":"123"}');
});


//swagger documentations.
app.get('/api/:filename', function(req, res){
    var filename = req.params.filename
    fs.readFile('./doc/' + filename, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      res.header('Access-Control-Allow-Origin', "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Content-Type", "application/json; charset=utf-8");
      res.header("X-Atmosphere-tracking-id", "af6c0948-9c64-4e63-8de9-bfcef482ae6c");
      res.send(200,data);
    });
});

app.listen(nconf.get('httpPort'));