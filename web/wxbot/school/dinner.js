/**
 * Usage:
 * 实现场所的介绍功能,需场所先绑定
 * Author:
 * hopesfish at 163.com
 */
var conf = require("../../conf");
var SchoolServices = require("../../services/SchoolServices");

module.exports = function(webot) {
	webot.set('school dinner', {
		domain: "school",
		pattern: function(info) {
			return info.param.eventKey === 'DINNER';
		},
		handler: function(info, next) {
			return next(null, [{
			  title: '每周食谱',
			  url: conf.site_root + "/front/dinner/" + info.session.school.id,
			  picUrl: conf.site_root + '/webot/wap/images/webanner.png',
			  description: '每周食谱',
			}]);
		}
	});
}