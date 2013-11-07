module.exports = function(webot) {
	webot.loads("weexiao", "place", "parent");

	// 默认欢迎词
	webot.set('greeting', {
		pattern: ".*",
		handler: function(info, next) {
			if (info.session.place) {
				next("欢迎使用" + info.session.place.name + "微信服务。");
			} else {
				next("欢迎使用本幼儿园微信服务。");
			}
		}
	});
}