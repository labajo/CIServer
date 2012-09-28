// jenkins external Agent.

// 3rd party libraries
var scraper = require('scraper');
var rest = require('restler');
var xml2js = require('xml2js');
var FeedParser = require('feedparser');
var parser = new xml2js.Parser();
var rssParser = new FeedParser();


// nconf engine.
var nconf;

function setConfigEngine(config){
    nconf = config;
}

//logging engine
var winston;
function setLoggingEngine(logging){
    winston = logging;
}

function getJenkinsProjects(allowedProjects, res){
    rest.get(nconf.get('jenkinsUrl') + 'cc.xml').on('complete', function(result, response) {
      if (result instanceof Error) {
          res.send(400,'{"error":1, "errorDetail": "Jenkins connection is out."}');
      } else { 
          if (response.statusCode == 404) {
            res.send(404,'{"error":2, "errorDetail": "Jenkins cc.xml not found"}');
          }else{
              parser.parseString(result, function (err, data) {
                  var aProjects;
                  try{
                      aProjects = allowedProjects.toString().split(',');
                      winston.info("aProjects: " + JSON.stringify(aProjects));
                  } catch(err){
                      aProjects = new Array();
                      winston.info("aProjects: " + JSON.stringify(aProjects));
                  }
                  
                  var projectArray = data.Projects.Project;
                  var resultArray = new Array();
                  for(i = 0; i < projectArray.length; i++){
                      if(aProjects.length != 0){
                          for(j=0;j<aProjects.length ; j++){
                              var pName = projectArray[i].$.name.toString();
                              if(aProjects[j]==pName){
                                  var project = new Project();
                                  project.name = pName;
                                  project.lastBuildTime = projectArray[i].$.lastBuildTime.toString();
                                  project.lastBuildStatus = projectArray[i].$.lastBuildStatus.toString();
                                  project.activity = projectArray[i].$.activity.toString();
                                  resultArray[resultArray.length] = project;
                              }
                          }
                      }
                      else{
                          var pName = projectArray[i].$.name.toString();
                          var project = new Project();
                          project.name = pName;
                          project.lastBuildTime = projectArray[i].$.lastBuildTime.toString();
                          project.lastBuildStatus = projectArray[i].$.lastBuildStatus.toString();
                          project.activity = projectArray[i].$.activity.toString();
                          resultArray[resultArray.length] = project;
                      }
                  }
                  winston.info(JSON.stringify(resultArray));
                  res.send(200,JSON.stringify(resultArray));
              });
          }
      }
     });
}

function getJenkinsProject(name, res){
    rest.get(nconf.get('jenkinsUrl') + 'cc.xml').on('complete', function(result, response) {
      if (result instanceof Error) {
          res.send(400,'{"error":1, "errorDetail": "Jenkins connection is out."}');
      } else { 
          if (response.statusCode == 404) {
            res.send(404,'{"error":2, "errorDetail": "Jenkins cc.xml not found"}');
          }else{
              parser.parseString(result, function (err, data) {
                  var projectArray = data.Projects.Project;
                  var project = new Project();
                  for(i = 0; i < projectArray.length; i++){
                      var projectName = projectArray[i].$.name.toString();
                      if(projectName == name){
                          project.name = projectName;
                          project.lastBuildTime = projectArray[i].$.lastBuildTime.toString();
                          project.lastBuildStatus = projectArray[i].$.lastBuildStatus.toString();
                          project.activity = projectArray[i].$.activity.toString();
                          break;
                      }
                  }
                  winston.info(JSON.stringify(project));
                  res.send(200,JSON.stringify(project));
              });
          }
      }
     });
}

function getJenkinsHistoryProject(name, res){
    winston.info('EA getJenkinsHistoryProject Method. Name: ' +  name);
    rssParser.parseUrl('http:///jenkins/job/Wallet-NoNFC-Platform/rssAll', function(err, meta, articles){
        if(err){
            winston.info('Jenkins connection is out.');
            res.send(400,'{"error":1, "errorDetail": "Jenkins connection is out."}');
        }
        
        var articlesSubArray = new Array();
        for(i = 0 ; i <7 ; i++){
            articlesSubArray[i] = articles[i];
        }
        
        res.send(200, JSON.stringify(articlesSubArray));
    }); 
    
    //res.send(200, '{"asdasd":"asdd"}');
}

function Project(){}

function getCIGameInfo( res){
    winston.info('EA getCiGameInfo Method.');
    scraper(nconf.get('jenkinsUrl') + 'cigame/', function(err, $) {
        if (err) {  
            winston.info('Jenkins connection is out.');
            res.send(400,'{"error":1, "errorDetail": "Jenkins connection is out."}');
        }else{
            //var result = "<html><head><title>Cigame</title></head><body><table>" + $('.pane.sortable').html() + "</table></body></html>";
            var domContent = $('.pane.sortable');
            var result = generateJsonFromHTML(domContent, $);
            res.send(result);
        }
    });
}


function getCIGamePoints(playerName, res){
    winston.info('EA getCiGameInfo Method. Name: ' + playerName);
    scraper(nconf.get('jenkinsUrl') + 'cigame/', function(err, $) {
        if (err) {  
            winston.info('Jenkins connection is out.');
            res.send(400,'{"error":1, "errorDetail": "Jenkins connection is out."}');
        }else{
            //var result = "<html><head><title>Cigame</title></head><body><table>" + $('.pane.sortable').html() + "</table></body></html>";
            var domContent = $('.pane.sortable');
            var result =JSON.parse(generateJsonFromHTML(domContent, $));
            var players = result.cigamePlayers;
            var points = '{"points": "';
            var pResult = '0';
            for(i = 0; i < players.length; i++){
                if(players[i].name.toString().localeCompare(playerName.toString())==0){
                    winston.info(players[i].points);
                    pResult = players[i].points;
                    break;
                }
            }
            points = points + pResult + '"}';
            res.send(200, points);
        }
    });
}

function generateJsonFromHTML(domContent, $){
    winston.info('Parsing DOM');
    var result = '{"error": 0, "cigamePlayers":[';
    var alternate = 1;
    var trig = false;
    domContent.children().each(function() {    
            if(trig){
                $(this).children().each(function() {
                    if(alternate==1){
                        result = result + '{\"name\": \"' + $(this).text() + '\", ';
                        alternate = 2;
                    }
                    else if(alternate==2)
                    {
                        alternate = 3;
                    }
                    else{
                        result = result + '\"points\": \"'+ $(this).text() + '\"}, ';
                        alternate = 1;
                    }
                });
            }else{
                trig = true;
            }
        });
        result = result.substring(0, result.length-2);
        result = result + ']}';
        return result;
}

module.exports.setConfigEngine = setConfigEngine;
module.exports.setLoggingEngine = setLoggingEngine;
module.exports.getCIGameInfo = getCIGameInfo;
module.exports.getCIGamePoints = getCIGamePoints;
module.exports.getJenkinsProjects = getJenkinsProjects;
module.exports.getJenkinsProject = getJenkinsProject;
module.exports.getJenkinsHistoryProject = getJenkinsHistoryProject;
