function Report(){}

Report.prototype.toString = function(){
    return JSON.stringify(this);
}

module.exports.Report = Report;