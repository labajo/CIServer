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





function getCIGameInfo(name, res){
    winston.info('getCIGameInfo Method. Name: ' + name);
    jenkinsEA.getCIGameInfo(name, res);
    //return result;
}

module.exports.setConfigEngine = setConfigEngine;
module.exports.setLoggingEngine = setLoggingEngine;
module.exports.getCIGameInfo = getCIGameInfo;