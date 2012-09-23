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


function getProjectMetrics(projectName, res){
 var baseUrl = nconf.get('sonarUrl');
 var sonarSuffix = nconf.get('sonarSuffix');
 var completeUrl = baseUrl + '/api/resources?resource=' + projectName + sonarSuffix;
 winston.info('SonarEA getProjectMetrics Method. ProjectName: ' + projectName);
 winston.info('Get over ' + completeUrl);
 rest.get(completeUrl).on('complete', function(result) {
  if (result instanceof Error) {
      res.send(400,'{"error":1, "errorDetail": "Sonar connection is out."}');
  } else {
      //var dataReaded = JSON.parse(result.toString());
      //if(dataReaded.err_code!=null)
      //{
      //    res.send(dataReaded.err_code,'{"error":2, "errorDetail": "Project not found"}');
      //}
      res.send(200,result);
  }
});
}


module.exports.setConfigEngine = setConfigEngine;
module.exports.setLoggingEngine = setLoggingEngine;
module.exports.getProjectMetrics = getProjectMetrics;
