/**
 * Usage:
 * - 注册家长微信账号
 * Author:
 * hopesfish at 163.com
 */
var utils = require("../utils");

module.exports = function(webot) {
	webot.loads("message", "image");

    webot.domain("parent", utils.ensure_parent_is_register);
}