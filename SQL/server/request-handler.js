/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var exports = module.exports = {};
var lastId = 0;
var fs = require('fs');
var helpers = require('mysqlHelpers.js');


var sendResponse = function(statusCode, responseText, response) {
  var headers = exports.defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  response.writeHead(statusCode, headers);
  response.end(responseText);
};

exports.handleRequest = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  //Parses the url and returns the room (if any)
  //Returns undefined if no room is in the url
  var getRoom = function(){
    var tempArr = request.url.split('/');
    var room;
    if (tempArr[1] === 'classes' && tempArr[2] === 'room') {
      room = tempArr[3];
    }
    return room;
  };

  //Adds message data to database
  var handlePostedMessage = function(data){
    var message = JSON.parse(data);
    helpers.addMessage(message);
  };

  var responseText = '';
  var room = getRoom();

  //Figures out what to do based on URL
  if(request.url.match(/\/classes\/messages\??.*/)){

    //Handles post requests
    if(request.method === 'POST'){
      request.on('data', handlePostedMessage);
      sendResponse(201, '', response);
    //Handles get requests
    } else {
      helpers.readMessages(function(messages) {
        var responseText = JSON.stringify({results: messages});
        console.log(responseText);
        sendResponse(200, responseText, response);
      });
    }
  } else if (room !== undefined) {
    if(request.method === 'POST') {
      request.on('data', handlePostedMessage);
      sendResponse(201, '', response);
    } else {
      helpers.readMessagesByRoom(room, function(messages) {
        var responseText = JSON.stringify({results: messages});
        sendResponse(200, responseText, response);
      });
    }
  } else {
    sendResponse(404, 'You\'re lost... Sincerely, The Internet', response);
  }
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
exports.defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
