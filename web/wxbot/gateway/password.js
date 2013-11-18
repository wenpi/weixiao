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
            '<a href="<%= url%>">请点击这里，修改密码</a>', 
            {
                //name: '大明',
                url: conf.site_root + '/password?parentId=' + info.session.parent.id
            }
        )
    } else if (info.session.teacher) {
        text = ejs.render(
            '<a href="<%= url%>">请点击这里，修改密码</a>', 
            {
                //name: '陈老师',
                url: conf.site_root + '/password?teacherId=' + info.session.teacher.id
            }
        )
    }
    return next(null, text);
}

module.exports = function(webot) {
	// 修改个人密码提示语
	webot.set('user password edit start by text', {
		domain: "gateway",
		pattern: /^(修改个人密码|(edit )?password)/i,
		handler: password_edit
	});
	webot.set('user password edit start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'PASSWORD_EDIT';
		},
		handler: password_edit
	});
}