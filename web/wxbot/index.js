var utils = require("./utils");

module.exports = function(webot) {
	webot.loads("weexiao", "gateway", "school", "parent");

	// 默认欢迎词
	webot.set('greeting', {
		pattern: ".*",
		handler: function(info, next) {
			if (info.session.school) {
				next("欢迎使用" + info.session.school.name + "微信服务。");
			} else {
				next("欢迎使用本幼儿园微信服务。");
			}
		}
	});

    // 定义school域, 检查幼儿园是否激活
    webot.beforeReply(utils.ensure_school_is_bind);
}