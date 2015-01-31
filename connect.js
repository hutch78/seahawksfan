var http = require('http');
var fs = require('fs');
var connect = require('connect');
var favicon = require('serve-favicon');
var morgan = require('morgan');
//make sure all packages are installed
var app = connect();

app.use(favicon(__dirname + '/public/favicon.ico'));
// store session state in browser cookie
var cookieSession = require('cookie-session')
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}))
// opens an access log write stream
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

// sets up logging (morgan)
app.use(morgan('combined', {stream: accessLogStream}))
//counts visits -- note that it will count the two hits per refresh until we add the favicon service
app.use(function(req, res, next) {
    var n = req.session.views || 0;
	req.session.views = ++n;
	res.end(n + ' views');
});
//creates the server at localhost:3000
http.createServer(app).listen(3000);


console.log('tjhis file is being used!!!');