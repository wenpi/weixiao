/**
 * Usage:
 * - 图片功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function add_image_start(info, next) {
	var prompt = "您发布的图片将对本班老师和家长公开，需在" + conf.timeout.desc + "内完成该项操作，请你输入发布主题：";
	if (info.session.parent) {
		info.wait("user image input text");
		return next(null, '家长，您好：<br/>' + prompt);
    } else if (info.session.teacher) {
		info.wait("teacher image input text");
		return next(null, '老师，您好：<br/>' + prompt);
    } else {
        return next(null, "抱歉，您不是认证用户，不能发布图片！");
    }
}

function view_image(info, next) {
    var text = "抱歉，您不是认证用户，不能查看图片！";
    if (info.session.parent) {
        text = ejs.render(
            '家长，您好：<br/><a href="<%= url%>">请点击这里，查看本班相册</a>', 
            {
                //name: '小一班',
                url: conf.site_root + '/message?shoolId' + info.session.school.id +' &parentId' + info.session.parent.id
            }
        )
    } else if (info.session.teacher) {
        text = ejs.render(
            '老师，您好：<br/><a href="<%= url%>">请点击这里，查看本班相册</a>', 
            {
                //name: '小一班',
                url: conf.site_root + '/message?shoolId' + info.session.school.id +' &teacherId' + info.session.teacher.id
            }
        )
    }
    return next(null, text);
}

module.exports = function(webot) {
	// 发布图片提示语
	webot.set('user image add start by text', {
		domain: "gateway",
		pattern: /^(发布图片|(publish )?image)/i,
		handler: add_image_start
	});
	webot.set('user image add start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.event === 'IMAGE_ADD';
		},
		handler: add_image_start
	});

    // 查看图片
    webot.set('user image view start by text', {
        domain: "gateway",
        pattern: /^(查看图片|(view )?image|我的图片)/i,
        handler: view_image
    });
    webot.set('user image view start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.event === 'IMAGE_VIEW';
        },
        handler: view_image
    });
}