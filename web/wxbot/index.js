var PlaceServices = require("../services/PlaceServices");

module.exports = function(webot) {
	webot.loads("bind");

	// 默认选项
	webot.set('greeting', {
		pattern: ".*",
		handler: function(info, next) {
			if (info.session.place) {
				next("欢迎使用" + info.session.place.name + "微信服务。本服务由weexiao.com提供运营支持。");
			} else {
				next("欢迎使用本幼儿园微信服务。本服务由weexiao.com提供运营支持。");
			}
		}
	});

	webot.beforeReply(function ensure_zhs(info, next) {
		// add alias
		info.from = info.uid;

		// 激活关键字
		if (info.text && info.text.indexOf("WEEXIAOBIND") === 0) { return next(); }

		// 检查幼儿园是否激活
		PlaceServices.query({weixinId: info.sp}, function(err, places) {
			if (err) {
				info.ended = true;
				return next(err);
			}

			if (places.length === 1) {
				info.session.place = places[0];
				return next();
			} else {
				info.ended = true;
				return next("抱歉，该幼儿园微信服务尚未激活。激活请输入: WEEXIAOBIND-{24位验证码}");
			}
		});
	});
}