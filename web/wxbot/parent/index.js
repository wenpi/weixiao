/**
 * Usage:
 * - 家长功能
 * Author:
 * hopesfish at 163.com
 */
var utils = require("../utils");

module.exports = function(webot) {
	webot.loads("message", "image", "record", "addparent", "leave");

    webot.domain("parent", utils.ensure_parent_is_register);
}