// main JS file

var express = require('express');
var app = express();

//Main endpoint
app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(8484);