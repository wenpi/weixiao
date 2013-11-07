/**
 * Usage:
 * 实现场所的激活功能(需要把toUserName和场所标识绑定起来)
 * Author:
 * hopesfish at 163.com
 */
var PlaceServices = require("../../services/PlaceServices");

module.exports = function(webot) {
	webot.set('place bind', {
		pattern: /^PLACEBIND-.*$/i,
		handler: function(info, next) {
			if (!info.is("text")) { next(); }
			if (info.session.place) { next(); }

			var uid = info.text.substring('PLACEBIND-'.length);
			PlaceServices.bind(uid, info.sp).then(function(place) {
				info.session.place = place;
				next(null, place.name + "绑定成功。");
			}, function(err) {
				throw err;
			}).fail(function(err) {
				next(null, err.message || err);
			});
		}
	});
}