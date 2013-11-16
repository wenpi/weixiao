/**
 * Usage:
 * - 成长记录功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function add_image_start(info, next) {
	var prompt = "请" + conf.timeout.desc + "内完成该项操作，本次发布主题是：";
	if (info.session.parent) {
		info.wait("user image input text");
		return next(null, prompt);
    } else if (info.session.teacher) {
		info.wait("teacher image input text");
		return next(null, prompt);
    } else {
        return next(null, "抱歉，您不是认证用户，不能发布成长记录！");
    }
}

function view_image(info, next) {
    var text = "抱歉，您不是认证用户，不能查看成长记录！";
    if (info.session.parent) {
        text = ejs.render(
            '您是<%= name%>">的家长。<br/><a href="<%= url%>">点击这里，立即查看孩子成长记录</a>', 
            {
                name: '小明',
                url: conf.site_root + '/record?shoolId' + info.session.school.id +' &parentId' + info.session.parent.id
            }
        )
    } else if (info.session.teacher) {
        text = ejs.render(
            '您是<%= name%>">的老师。<br/><a href="<%= url%>">点击这里，立即查看孩子成长记录</a>', 
            {
                name: '小明',
                url: conf.site_root + '/record?shoolId' + info.session.school.id +' &teacherId' + info.session.teacher.id
            }
        )
    }
    return next(null, text);
}

module.exports = function(webot) {
	// 发布成长记录提示语
	webot.set('user image add start by text', {
		domain: "user",
		pattern: /^(发布成长记录|(publish )?image)/i,
		handler: add_image_start
	});
	webot.set('user image add start by event', {
		domain: "user",
		pattern: function(info) {
			return info.event === 'IMAGE_ADD';
		},
		handler: add_image_start
	});

    // 查看成长记录
    webot.set('user image view start by text', {
        domain: "user",
        pattern: /^(查看成长记录|(view )?image|我的成长记录)/i,
        handler: view_image
    });
    webot.set('user image view start by event', {
        domain: "user",
        pattern: function(info) {
            return info.event === 'IMAGE_VIEW';
        },
        handler: view_image
    });
}