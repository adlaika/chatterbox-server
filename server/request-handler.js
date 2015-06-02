/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var fs = require('fs');
var url = require( "url" );
var queryString = require( "querystring" );

var messages = {
  'firstRoom' : [
                 {  'username': 'TESTMAN',
                    'text': 'lorem ipsum doucheum',
                    'roomname': 'KNEE DEEP IN THE DEAD',
                    'createdAt': '0'}
                ]
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "application/json";


  var getMessages = function() {
    // console.log(url.parse(request.url))
    var results = [];
    if(request.url === '/classes/messages') {
      // fs.readFile('messages.json', function read(err, data) {
      //   if (err) {
      //     throw err;
      //   } else {
      //     console.log('getMessages log:' + data);
      //     var messages = JSON.parse(data);
      //     var results = [];
      //     for(var key in messages) {
      //       results.push(data[key]);
      //     }
      //     response.writeHead('200', headers);
      //     response.end(JSON.stringify({'results': results}));
      //   }
      // });
      response.writeHead('200', headers);
      for(var room in messages) {
        for(var i = 0; i < messages[room].length; i++) {
          results.push(messages[room][i]);
        }
      }
      response.end(JSON.stringify({'results': results}));
    }
    // else {
    //   response.writeHead(404, {'Content-Type': 'text/html'});
    //   // response.write('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
    //   response.end();
    // }
  };

  var postMessage = function() {
    if(!messages[request.url]) {
      messages[request.url] = [];
    }

    var messageString = "";
    request.on('data', function(data) {
      messageString += data;
    });

    request.on('end', function(){
      var message = JSON.parse(messageString);
      message.createdAt = new Date();
      messages[request.url].unshift(message);
      response.writeHead(201, headers);
      response.end(JSON.stringify(messages));
    });
  }



  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.



  // if (request.method === 'GET') {
  //   if (request.url === '/messages') {
  //     fs.readFile('./messages.json', function (err, data) {
  //       if (err) throw err;
  //       console.log(data);
  //       response.end(data);
  //     });
  //   }
  // } else if (request.method === 'POST') {
  //   fs.appendFile("./messages.json", request.data);
  // }

  if(request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  } else if (request.method === 'GET') {
    getMessages();
  } else if (request.method === 'POST') {
    postMessage();
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;

