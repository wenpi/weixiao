/**
 * 用途:
 * 1 将微信账号和幼儿园标识绑定起来
 * 2 返回幼儿园介绍信息
 */
var PlaceServices = require("../../services/PlaceServices");

module.exports = function(webot) {

	// 除了bind,其他服务都必须在place域下面
	webot.loads("bind", "intro");

	// 定义place域, 检查幼儿园是否激活
	webot.domain("place", function ensure_place_is_bind(info, next) {
		if (info.session.place) { next(); }

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
				return next("抱歉，该幼儿园微信服务尚未激活。激活请输入: PLACEBIND-{24位验证码}");
			}
		});
	});
}