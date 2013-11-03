/**
 * Module dependencies.
 */
var express = require('express');
var xmlparser = require("./utils/XMLParser");
var http = require('http');
var path = require('path');
var i18n = require("i18n");

var defaultRoutes = require('./routes/mobile/index');
var userRoutes = require('./routes/mobile/user.js');

var app = express();

// i18n locales
i18n.configure({{
    locales:['en', 'cn'],
    directory: __dirname + '/locales',
    extension: '.js'
});
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(xmlparser.xml());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(i18n.init);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// the web gui for the end user
app.get('/mobile', defaultRoutes.index);
app.get("/mobile/register", userRoutes.register);

// the rest api of the weixiao

// the api for weixin stuff

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
