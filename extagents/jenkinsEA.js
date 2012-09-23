// jenkins external Agent.

var scraper = require('scraper');

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

function getCIGameInfo(name, res){
    winston.info('EA getCiGameInfo Method. Name: ' + name);
    scraper(nconf.get('jenkinsUrl'), function(err, $) {
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