/**
 * 用途:
 * 1 介绍微笑服务信息
 */
module.exports = function(webot) {
	// 介绍weexiao
	webot.set('weexiao greeting', {
		pattern: /^WEEXIAO$/i,
		handler: function(info, next) {
			next("让幼教更美好!");
		}
	});
}