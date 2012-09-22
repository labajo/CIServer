// cigame service

// nconf engine.
var nconf;

function setConfigEngine(config){
    nconf = config;
}

var winston;
function setLoggingEngine(logging){
    winston = logging;
}



function getCiGameInfo(name){
    winston.info('getCiGameInfo Method. Name: ' + name);
    return 'Hola ' + name + nconf.get('jenkinsUrl');
}

module.exports.setConfigEngine = setConfigEngine;
module.exports.setLoggingEngine = setLoggingEngine;
module.exports.getCiGameInfo = getCiGameInfo;