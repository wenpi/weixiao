/**
 * Usage:
 * - 注册家长微信账号
 * Author:
 * hopesfish at 163.com
 */
module.exports = function(webot) {
	// 除了register,其他都要经过验证
	webot.loads("register", "message");

    // 定义place域, 检查幼儿园是否激活
    webot.domain("parent", utils.ensure_parent_is_register);
}