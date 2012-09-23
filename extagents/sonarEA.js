// sonar external agent

// 3rd party libraries
var rest = require('restler');

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

// Get project Metrics from Sonar.
function getProjectMetrics(projectName, res){
     var baseUrl = nconf.get('sonarUrl');
     var sonarSuffix = nconf.get('sonarSuffix');
     var completeUrl = baseUrl + '/api/resources?resource=' + projectName + sonarSuffix;
     winston.info('SonarEA getProjectMetrics Method. ProjectName: ' + projectName);
     winston.info('Get over ' + completeUrl);
     rest.get(completeUrl).on('complete', function(result, response) {
      if (result instanceof Error) {
          res.send(400,'{"error":1, "errorDetail": "Sonar connection is out."}');
      } else { 
          if (response.statusCode == 404) {
            res.send(404,'{"error":2, "errorDetail": "Project not found"}');
          }else{
              //winston.info(result[0].key);
              var sonarObj = convertToSonarObj(result);
              res.send(200,sonarObj);
          }
      }
     });
}

function convertToSonarObj(origJson){
    var sonarObj = new SonarObj();
    sonarObj.project = origJson[0].key;
    var msrArray = origJson[0].msr;
    for(i = 0; i < msrArray.length; i++){
      if(msrArray[i].key == 'ncloc'){
          sonarObj.lines = msrArray[i].val;
      } else if(msrArray[i].key == 'coverage'){
          sonarObj.coverage = msrArray[i].val;
      } else if(msrArray[i].key == 'duplicated_lines_density'){
          sonarObj.duplicated = msrArray[i].val;
      } else if(msrArray[i].key == 'violations_density'){
          sonarObj.violations = msrArray[i].val;
      } else if(msrArray[i].key == 'critical_violations'){
          sonarObj.critical = msrArray[i].val;
      } else if(msrArray[i].key == 'major_violations'){
          sonarObj.major = msrArray[i].val;
      }
    }
    winston.info(sonarObj.toString());
    return sonarObj;
}

function SonarObj(){}
SonarObj.prototype.toString = function(){
    return JSON.stringify(this);
}


module.exports.setConfigEngine = setConfigEngine;
module.exports.setLoggingEngine = setLoggingEngine;
module.exports.getProjectMetrics = getProjectMetrics;
