/**
 * Module dependencies.
 */
var express = require('express');
var debug = require('debug');
var log = debug('weexiao');
var error = debug('weexiao:error');

var conf = require('./conf');

var http = require('http');
var path = require('path');

/*
 * webot for weixin invoke
 */ 
var webot = require('weixin-robot');

var app = express();

// all environments
app._conf = conf;
app.set('port', conf.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({secret: 'weixin secret', cookie: {maxAge: 60000}}));
app.use(express.query());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// define the routes
require("./routes")(app);

// the rest api of the weixiao

// the api for weixin stuff
require("./wxbot")(app, webot);
webot.watch(app, { token: conf.weixin, path: '/weixin/api' });


var port = conf.port || 3000;
var hostname = conf.hostname || '127.0.0.1';

app.listen(port, hostname, function() {
  log('listening on ', hostname, port);
});

app.enable('trust proxy');