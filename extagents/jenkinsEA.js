// jenkins external Agent.

// nconf engine.
var nconf;

function setConfigEngine(config){
    nconf = config;
}

var winston;
function setLoggingEngine(logging){
    winston = logging;
}


function getCIGameInfo(name){
    winston.info('EA getCiGameInfo Method. Name: ' + name);
    return 'Hola ' + name + nconf.get('httpPort');
}

module.exports.setConfigEngine = setConfigEngine;
module.exports.setLoggingEngine = setLoggingEngine;
module.exports.getCIGameInfo = getCIGameInfo;