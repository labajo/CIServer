// jenkins external Agent.

var scraper = require('scraper');

// nconf engine.
var nconf;

function setConfigEngine(config){
    nconf = config;
}

var winston;
function setLoggingEngine(logging){
    winston = logging;
}

function getCIGameInfo(name, res){
    winston.info('EA getCiGameInfo Method. Name: ' + name);
    scraper(nconf.get('jenkinsUrl'), function(err, $) {
        if (err) {throw err;}
        var result = "<html><head><title>Cigame</title></head><body><table>" + $('.pane.sortable').html() + "</table></body></html>";
        winston.info(result);
        res.send(result);
    });
    
}

module.exports.setConfigEngine = setConfigEngine;
module.exports.setLoggingEngine = setLoggingEngine;
module.exports.getCIGameInfo = getCIGameInfo;