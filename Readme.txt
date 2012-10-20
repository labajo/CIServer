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
5. Create a system with two layers.(Main layer(app.js), Ext Agents).
6. Add scraper to download page contents and analyze it.
7. Add header to allow swagger compatibility.
8. Add FS dependency to read json files for swagger web.
9. Add Restler dependency to have a rest client for sonar.
10.Add Xml2Js dependency to convert xml into json.
11.Add FeedPareser dependency to read rss feed from jenkins.
12.Add mongoose dependency to save collections in Mongo. Reporting.
