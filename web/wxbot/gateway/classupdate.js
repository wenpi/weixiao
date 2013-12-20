/**
 * Usage:
 * - 修改密码功能
 * Author:
 * - hopesfish at 163.com
 */
var conf = require('../../conf');

function send_update(info, next) {
    return next(null, [{
	  title: '留言板',
	  url: conf.site_root + '/front/message',
	  picUrl: conf.site_root + '/webot/wap/images/message.png',
	  description: '留言板'
	}, {
	  title: '班级相册',
	  url: conf.site_root + '/classPhoto/mobileview',
	  picUrl: conf.site_root + '/webot/wap/images/photo.png',
	  description: '班级相册'
	}, {
	  title: '成长记录',
	  url: conf.site_root + '/webot/wap/help/message',
	  picUrl: conf.site_root + '/webot/wap/images/record.png',
	  description: '成长记录'
	}, {
	  title: '课程计划',
	  url: conf.site_root + '/webot/wap/help/message',
	  picUrl: conf.site_root + '/webot/wap/images/course.png',
	  description: '课程计划'
	}]);
}

module.exports = function(webot) {
	webot.set('weexiao help by text', {
		pattern: /^(班级动态)/i,
		handler: send_update
	});
	webot.set('weexiao help by event', {
		pattern: function(info) {
			return info.param.eventKey === 'CLASS_UPDATE';
		},
		handler: send_update
	});
}