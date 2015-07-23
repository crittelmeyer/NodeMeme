/* 

	app.js

	Initializes server. Sets up static content. Establishes routes and 
	their handlers.

	Written by Sam Reaves
	July 22, 2015

 */


// Import Express and initialize server. 
var express = require('express'),
	app = module.exports.app = exports.app = express(),
	path = require('path');

// Establish static directory at client/public
app.use(express.static(path.join(__dirname, '../client/static')));

// Route handler for root - sends current static landing page
app.get('/', function(req, res) {
  res.sendfile("index.html");
});

// Server starts listening on port 3000.
var server = app.listen(3000, function() {
  
  // Grab host and port from server's address method
  var host = server.address().address,
  	  port = server.address().port;

  // Logs a message to let dev know we're up and running.
  console.log('Example app listening at http://%s:%s', host, port);
});