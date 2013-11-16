/**
 * Usage:
 * - 课程安排功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function course_view(info, next) {
    var text = "抱歉，您不是认证用户，不能查看课程安排！";
    if (info.session.parent) {
        text = ejs.render(
            '您是认证家长:"<%= name%>">。<br/><a href="<%= url%>">点击这里，立即查看课程安排</a>', 
            {
                name: '大明',
                url: conf.site_root + '/course?parentId' + info.session.parent.id
            }
        )
    } else if (info.session.teacher) {
        text = ejs.render(
            '您是认证老师:"<%= name%>">。<br/><a href="<%= url%>">点击这里，立即查看课程安排</a>', 
            {
                name: '陈老师',
                url: conf.site_root + '/course?teacherId' + info.session.teacher.id
            }
        )
    }
    return next(null, text);
}

module.exports = function(webot) {
	// 修改个人资料提示语
	webot.set('user course view start by text', {
		domain: "user",
		pattern: /^(课程安排|(view )?course)/i,
		handler: course_view
	});
	webot.set('user course view start by event', {
		domain: "user",
		pattern: function(info) {
			return info.event === 'COURSE_VIEW';
		},
		handler: course_view
	});
}