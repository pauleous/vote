
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var io = require('socket.io');
var mongodb = require('mongodb');
var winston = require('winston');
//var MongoDB = require('winston-mongodb').MongoDB;
//winston.add(MongoDB, {db:'hacknashville', safe:false});
//winston.add(winston.transports.Console);
var MongoStore = require('connect-mongo')(express);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
var mongoObject = {
  'client': mongodb.MongoClient,
  'format': require('util').format,
  'database': 'mongodb://127.0.0.1:27017/test'
};
app.use(express.cookieParser());
app.use(express.session({
	secret: 'foobarbaz',
	store: new MongoStore({
		url: 'mongodb://127.0.0.1:27017/test'
	}),
	key: 'express.sid'
}));
app.use(app.router);

var sio = io.listen(9001);
sio.sockets.on('connection', function(socket){
	console.log('a socket has connected');
	socket.emit('foo', 'bar');
});

var config = require('./config').config();

mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db){
if(err){
			console.log('error!', err);
		} else {
			console.log('mongo connected!');
			//db.use('test');
			routes(sio, db, config);
		}
});

function routes(sio, db, config) {
	
	var items = require('./api/items')(config);
	var votes = require('./api/votes')(sio, db, config);
	
	app.get('/', function(req, res){
		console.log(req.session);
		req.session.voted = true;
		res.send('ok');
	});
	
	app.get('/api/items', items.list);
	app.post('/api/vote/:id', votes.vote);
	app.get('/api/results', votes.results);
	
	// api errors
	app.use(function failure (error, request, response, next ) {
			if ( error ) {
					winston.error(error.stack);
					response.send(500, 'Server Error');
			} else {
					next();
			}
	});
	
	// development only
	if ('development' == app.get('env')) {
			app.use(express.errorHandler());
	}
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
