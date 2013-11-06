/**
 * 用途:
 * 1,实现场所的激活功能(需要把toUserName和场所标识绑定起来)
 */
var PlaceServices = require("../../services/PlaceServices");

module.exports = function(webot) {
	var pattern = /^WEEXIAOBIND-.*$/i;
	webot.set('bind place start', {
		pattern: pattern,
		handler: function(info, next) {
			var uid = info.text.substring(12);
			// 根据标识查询
			PlaceServices.get(uid).then(function(place) {
				if (place && place.enabled === false) {
					place.weixinId = info.sp;
					place.enabled = true;
					PlaceServices.update(place).then(function() {
						next(null, place.name + "激活成功!");
					}, function() {
						next(null, "服务异常，请重新输入或者联系服务提供商。");
					});
				} else {
					next(null, "标识码输入错误或者该幼儿园已激活。");
				}
			}, function(err) {
				next(null, "标识码输入错误，请重新输入。");
			});
		}
	});
}