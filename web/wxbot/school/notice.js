/**
 * Usage:
 * 实现场所的介绍功能,需场所先绑定
 * Author:
 * hopesfish at 163.com
 */
var conf = require("../../conf");
var SchoolServices = require("../../services/SchoolServices");

module.exports = function(webot) {
	webot.set('school notice', {
		domain: "school",
		pattern: function(info) {
			return info.param.eventKey === 'NOTICE';
		},
		handler: function(info, next) {
			return next(null, [{
			  title: '全园播报',
			  url: conf.site_root + "/front/notice/" + info.session.school.id,
			  picUrl: conf.site_root + '/webot/wap/images/webot/webanner.png',
			  description: '最新学校动态',
			}]);
		}
	});
}