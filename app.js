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
var jenkinsEA = require('./extagents/jenkinsEA.js');
jenkinsEA.setConfigEngine(nconf);
jenkinsEA.setLoggingEngine(winston);

var sonarEA = require('./extagents/sonarEA.js');
sonarEA.setConfigEngine(nconf);
sonarEA.setLoggingEngine(winston);

var reportModule = require('./model/report.js');

var mongoose = require('mongoose');
var db;
var Report;
if(nconf.get('mongoActive')){
    var db = mongoose.createConnection(nconf.get('mongoServer'), nconf.get('mongoDatabase'));
    var schema = mongoose.Schema({ method: 'string', date: 'string', ip:'string', parameter:'string'});
    Report = db.model('Report', schema);
}



//Main endpoint
app.get('/:name', function(req, res){
  var nameRequest = req.params.name;
  if(nameRequest=='favicon.ico'){
      return;
  }
  
  report('Main EndPoint', req.connection.remoteAddress, nameRequest, function(err){
      if(err){
          winston.error('Report engine error.');
      }
  });
  
  winston.info('Main endpoint. Name: ' + nameRequest);
  
    res.send(200, 'Main endpoint');
});



// jenkins projects json endpoint
app.get('/jenkins/projects', function(req, res){
    var allowedProjects = req.query["allowedProjects"];
    winston.info('Projects endpoint. AllowedProjects: ' + allowedProjects);
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Content-Type", "application/json; charset=utf-8");
    res.header("X-Atmosphere-tracking-id", "af6c0948-9c64-4e63-8de9-bfcef482ae6c");
    report('Jenkins all projects EndPoint', req.connection.remoteAddress, allowedProjects, function(err){
      if(err){
          winston.error('Report engine error.');
      }
    });
    jenkinsEA.getJenkinsProjects(allowedProjects, res);
});

// jenkins projects json endpoint
app.get('/jenkins/projects/:name', function(req, res){
    var name = req.params.name;
    winston.info('Project endpoint. Name: ' + name);
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Content-Type", "application/json; charset=utf-8");
    res.header("X-Atmosphere-tracking-id", "af6c0948-9c64-4e63-8de9-bfcef482ae6c");
    report('Get Jenkins Project', req.connection.remoteAddress, name, function(err){
      if(err){
          winston.error('Report engine error.');
      }
    });
    jenkinsEA.getJenkinsProject(name,res);
});

// jenkins project history endpoint
app.get('/jenkins/projects/:name/history', function(req, res){
    var name = req.params.name;
    winston.info('History project endpoint. Name: ' + name);
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Content-Type", "application/json; charset=utf-8");
    res.header("X-Atmosphere-tracking-id", "af6c0948-9c64-4e63-8de9-bfcef482ae6c");
    report('Jenkins history project', req.connection.remoteAddress, name, function(err){
      if(err){
          winston.error('Report engine error.');
      }
    });
    jenkinsEA.getJenkinsHistoryProject(name,res);
});


// Cigame json endpoint
app.get('/jenkins/cigame', function(req, res){
    winston.info('Cigame endpoint.');
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Content-Type", "application/json; charset=utf-8");
    res.header("X-Atmosphere-tracking-id", "af6c0948-9c64-4e63-8de9-bfcef482ae6c");
    report('Get cigame Info', req.connection.remoteAddress, null, function(err){
      if(err){
          winston.error('Report engine error.');
      }
    });
    jenkinsEA.getCIGameInfo( res);
});

//Cigame user endpoint
app.get('/jenkins/cigame/:name', function(req, res){
  var name = req.params.name;
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Content-Type", "application/json; charset=utf-8");
  res.header("X-Atmosphere-tracking-id", "af6c0948-9c64-4e63-8de9-bfcef482ae6c");
  if(name=='favicon.ico'){
      return;
  }
  report('Get Cigame Score of a User', req.connection.remoteAddress, name, function(err){
      if(err){
          winston.error('Report engine error.');
      }
  });
  winston.info('Main endpoint. Name: ' + name);
  jenkinsEA.getCIGamePoints(name, res);
});

//sonar json endpoint
app.get('/sonar/:projectname', function(req, res){
    var projectname = req.params.projectname;
    winston.info('Sonar endpoint. Project: ' + projectname);
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Content-Type", "application/json; charset=utf-8");
    res.header("X-Atmosphere-tracking-id", "af6c0948-9c64-4e63-8de9-bfcef482ae6c");
    //sonarEA.getProjectMetrics(projectname, res);
    
    
    /*sonarEA.asyncMetrics(projectname, function(err, result) {
      if (err){}
        // error: propagate it or handle it
      else{
        res.send(200, result)
        }
    });*/
    report('Get Sonar metrics of a project', req.connection.remoteAddress, projectname, function(err){
      if(err){
          winston.error('Report engine error.');
      }
    });
    sonarEA.superAsyncMetrics(projectname, function(err, result) {
      if (err){}
        // error: propagate it or handle it
      else{
        res.send(200, result);
        }
    });
    
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


//Save calls in MongoDb parallel mode.
function report(methodName, remoteIp, parameter, callback){
    if(nconf.get('mongoActive')){
    var now = new Date();
    var jsonDate = now.toJSON();
      var report = new Report({method: methodName, date: jsonDate, ip: remoteIp, parameter:parameter});
        report.save(function (err) {
          winston.info('Report added.');
          callback(err);
        });
  }
}

app.listen(nconf.get('httpPort'));