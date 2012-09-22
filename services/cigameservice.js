// cigame service

// nconf engine.
var nconf;

function setConfigEngine(config){
    nconf = config;
}



function getCiGameInfo(name){
    return 'Hola ' + name + nconf.get('jenkinsUrl');
}

module.exports.setConfigEngine = setConfigEngine;
module.exports.getCiGameInfo = getCiGameInfo;