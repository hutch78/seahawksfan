console.log('Hello World');

var http = require('http');

//Stage two: a simple webserver
/* 
http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello World');
  response.end();
}).listen(3000);
*/

//Stage three: using functions
/*
function onRequest(request, response) {
  console.log('Pinged.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello World!');
  response.end();
}

http.createServer(onRequest).listen(3000);

console.log('Server started!');
*/

//Stage four: switching to HTML output
/*
function onRequest(request, response) {
  console.log('Pinged.');
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write('<h3>Hello World!</h3>');
  response.end();
}

http.createServer(onRequest).listen(3000);

console.log('Server started!');*/

//Stage five: using the "FileSystem" module

var fs = require('fs');
function onRequest(request, response) {
	console.log('Pinged.');
	fs.readFile('index.html', function(error, content) {
		if (error) {
			response.writeHead(500);
			response.end();
		}
		else {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.end(content, 'utf-8');
		}
	});
}
http.createServer(onRequest).listen(3000);

console.log('Server started!');