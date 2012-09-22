#   CI Server Node Js

# Author: jherlab@gmail.com

# Date: 21/09/12

Description:
Server that scraping jenkins webs or XML Feeds in order 
to transform the obtained information in json format. This
server transform sonar information too.


Develop Steps:
1. Install nodemon to reload the execution automatically. sudo npm install -g nodemon
2. Install express in the project. npm install express
3. Install nconf to have json configuration files.
4. Install an asyn logging library (winston).
5. Create a system with three layers.(Main layer(app.js), Services, Ext Agents).

