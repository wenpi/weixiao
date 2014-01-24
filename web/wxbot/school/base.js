/**
 * Usage:
 * 实现场所的介绍功能,需场所先绑定
 * Author:
 * hopesfish at 163.com
 */
var conf = require("../../conf");

module.exports = function(webot) {
	webot.set('school about', {
		domain: "school",
		pattern: function(info) {
			return info.param.eventKey === 'ABOUT';
		},
		handler: function(info, next) {
			return next(null, [{
			  title: '关于本园',
			  url: conf.site_root + "/front/" + info.session.school.id,
			  picUrl: conf.site_root + '/webot/wap/images/webot/intro.png',
			  description: '幼儿园介绍',
			}]);
		}
	});

	webot.set('school dinner', {
		domain: "school",
		pattern: function(info) {
			return info.param.eventKey === 'DINNER';
		},
		handler: function(info, next) {
			return next(null, [{
			  title: '每周食谱',
			  url: conf.site_root + "/front/dinner/" + info.session.school.id,
			  picUrl: conf.site_root + '/webot/wap/images/webot/dinner.png',
			  description: '每周食谱',
			}]);
		}
	});

	webot.set('school notice', {
		domain: "school",
		pattern: function(info) {
			return info.param.eventKey === 'NOTICE';
		},
		handler: function(info, next) {
			return next(null, [{
			  title: '全园播报',
			  url: conf.site_root + "/front/notice/" + info.session.school.id,
			  picUrl: conf.site_root + '/webot/wap/images/webot/news.png',
			  description: '最新学校动态',
			}]);
		}
	});
}