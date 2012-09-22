// cigame service

//local requirements.
var jenkinsEA = require('../extagents/jenkinsEA.js');

// nconf engine.
var nconf;

function setConfigEngine(config){
    nconf = config;
    jenkinsEA.setConfigEngine(nconf);
}

// winston engine.
var winston;
function setLoggingEngine(logging){
    winston = logging;
    jenkinsEA.setLoggingEngine(winston);
}





function getCiGameInfo(name){
    winston.info('getCiGameInfo Method. Name: ' + name);
    var saludo = jenkinsEA.getCIGameInfo(name);
    return saludo;
    
}

module.exports.setConfigEngine = setConfigEngine;
module.exports.setLoggingEngine = setLoggingEngine;
module.exports.getCiGameInfo = getCiGameInfo;