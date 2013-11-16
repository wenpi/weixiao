/**
 * Usage:
 * - 修改密码功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function password_edit(info, next) {
    var text = "抱歉，您不是认证用户，不能修改密码！";
    if (info.session.parent) {
        text = ejs.render(
            '您是认证家长:"<%= name%>">。<br/><a href="<%= url%>">点击这里，立即修改密码</a>', 
            {
                name: '大明',
                url: conf.site_root + '/password?parentId' + info.session.parent.id
            }
        )
    } else if (info.session.teacher) {
        text = ejs.render(
            '您是认证老师:"<%= name%>">。<br/><a href="<%= url%>">点击这里，立即修改密码</a>', 
            {
                name: '陈老师',
                url: conf.site_root + '/password?teacherId' + info.session.teacher.id
            }
        )
    }
    return next(null, text);
}

module.exports = function(webot) {
	// 修改个人资料提示语
	webot.set('user password edit start by text', {
		domain: "user",
		pattern: /^(修改个人资料|(edit )?password)/i,
		handler: password_edit
	});
	webot.set('user password edit start by event', {
		domain: "user",
		pattern: function(info) {
			return info.event === 'PROFILE_EDIT';
		},
		handler: password_edit
	});
}