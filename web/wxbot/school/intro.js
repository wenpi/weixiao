/**
 * Usage:
 * 实现场所的介绍功能,需场所先绑定
 * Author:
 * hopesfish at 163.com
 */
var SchoolServices = require("../../services/SchoolServices");

module.exports = function(webot) {
	webot.set('school intro', {
		domain: "school",
		pattern: /^PLACEINTRO$/i,
		handler: function(info, next) {
			next(null, "场所介绍");
		}
	});
}