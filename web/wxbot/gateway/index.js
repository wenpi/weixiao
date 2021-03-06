/**
 * Usage:
 * - 网关入口
 * Author:
 * hopesfish at 163.com
 */
var utils = require("../utils");

module.exports = function(webot) {
	// 除了register,其他都要经过验证
	webot.loads("register", "profile", "photo", "message", "gallery", "path", "leave", "course", "classupdate");

    // 定义gateway/parent/teacher域, 将判断该用户是否可以进行激活操作
    webot.domain("gateway", utils.ensure_user_is_register);
}