module.exports = function(app, webot) {
	// 指定回复消息
	webot.set('hi', '你好');

	webot.set('subscribe', {
		pattern: function(info) {
			return info.is('event') && info.param.event === 'subscribe';
		},
		handler: function(info) {
			return '欢迎订阅微信机器人';
		}
	});
}