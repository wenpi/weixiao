/**
 * Usage:
 * 实现场所的激活功能(需要把toUserName和场所标识绑定起来)
 * Author:
 * hopesfish at 163.com
 */
var SchoolServices = require("../../services/SchoolServices");

module.exports = function(webot) {
	webot.set('school bind', {
		pattern: /^PLACEBIND-.*$/i,
		handler: function(info, next) {
			if (!info.is("text")) { next(); }
			if (info.session.school) { next(); }

			var uid = info.text.substring('PLACEBIND-'.length);
			SchoolServices.bind(uid, info.sp).then(function(school) {
				info.session.school = school;
				next(null, school.name + "绑定成功。");
			}, function(err) {
				throw err;
			}).fail(function(err) {
				next(null, err.message || err);
			});
		}
	});
}