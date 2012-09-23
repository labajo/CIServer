// sonar external agent


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


function getProjectMetrics(projectName){
 var baseUrl = nconf.get('sonarUrl');
 var sonarSuffix = nconf.get('sonarSuffix');
 var completeUrl = baseUrl + '/api/resources?resource=' + projectName + sonarSuffix;
 
}



