/**
 * Module dependencies.
 */
// 服务器配置
var conf = require('./conf');
// 日志输出
var debug = require('debug');
var log = debug('weexiao');
var error = debug('weexiao:error');
// Express依赖
var express = require('express');
var http = require('http');
var path = require('path');

// 配置Express
var app = express();
app._conf = conf;
app.set('port', conf.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
	secret: 'keyboardcat123',
	store: new express.session.MemoryStore(),
    expires: new Date(Date.now() + conf.timeout.val)
}));
//app.use(express.session({secret: 'weexiao secret', cookie: {maxAge: conf.timeout.val}}));
app.use(express.query());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// WAP站点的页面流控制类
require("./routes")(app);

// REST API
require("./rest")(app);

// 回复机器人
var webot = require('weixin-robot');
require("./wxbot")(webot);
webot.watch(app, { token: conf.weixin, path: '/weixin/api' });

// 启动express
var port = conf.port || 3001;
var hostname = conf.hostname || '127.0.0.1';
app.listen(port, function() {
  console.info('listening on ', hostname, port);
});
app.enable('trust proxy');