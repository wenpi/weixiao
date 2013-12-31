/**
 * Usage:
 * - 修改密码功能
 * Author:
 * - hopesfish at 163.com
 */
var conf = require('../../conf');

function send_update(info, next) {
	var t = conf.online ? '' : (new Date()).getTime();
    if (info.session.teacher) {
        if (info.session.teacher.isAdmin === 1) {
            return next(null, "抱歉！园长，管理员暂时需通过PC端使用！");
        }
    }
    var links = [{
		title: '留言板',
		url: conf.site_root + '/front/message',
		picUrl: conf.site_root + '/webot/wap/images/message.png?t=' + t,
		description: '留言板'
	}, {
		title: '班级相册',
		url: conf.site_root + '/classPhoto/mobileview',
		picUrl: conf.site_root + '/webot/wap/images/photo.png?t=' + t,
		description: '班级相册'
	}];

	if (info.session.parent) {
		links.push({
			title: '成长记录',
			url: conf.site_root + '/studentPath/mobileView',
			picUrl: conf.site_root + '/webot/wap/images/record.png?t=' + t,
			description: '成长记录'
		});
	} else if (info.session.teacher) {
		if (info.session.teacher.isAdmin === 0 &&
			info.session.teacher.wxclasses &&
			info.session.teacher.wxclasses.length == 1) {
			links.push({
				title: '成长记录',
				url: conf.site_root + '/webot/wap/school/' + info.session.school.id + "/class/" + info.session.teacher.wxclasses[0].id + "/record/entry",
				picUrl: conf.site_root + '/webot/wap/images/record.png?t=' + t,
				description: '成长记录'
			});
		}
	}

	links.push({
		title: '课程计划',
		url: conf.site_root + '/front/course',
		picUrl: conf.site_root + '/webot/wap/images/course.png?t=' + t,
		description: '课程计划'
	});

    return next(null, links);
}

module.exports = function(webot) {
	webot.set('weexiao help by text', {
		domain: "gateway",
		pattern: /^(班级动态)/i,
		handler: send_update
	});
	webot.set('weexiao help by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'CLASS_UPDATE';
		},
		handler: send_update
	});
}