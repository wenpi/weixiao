/**
 * 用途:
 * 1 将微信账号和幼儿园标识绑定起来
 * 2 返回幼儿园介绍信息
 */
var utils = require("../utils");
var SchoolServices = require("../../services/SchoolServices");

module.exports = function(webot) {

    // 除了bind,其他服务都必须在school域下面
    webot.loads("base", "life", "help");

    // 定义school域, 检查幼儿园是否激活
    webot.domain("school", utils.ensure_school_is_bind);

	webot.set('school bind', {
		pattern: /^SCHOOLBIND-.*$/i,
		handler: function(info, next) {
			if (!info.is("text")) { next(); }
			if (info.session.school) { next(); }

			var uid = info.text.substring('SCHOOLBIND-'.length);
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