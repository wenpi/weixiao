/**
 * Usage:
 * - 成长记录功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function add_image_start(info, next) {
	var prompt = "发布文字记录请回复【1】<br/>发布照片记录请回复【2】";
	if (info.session.parent) {
		info.wait("parent kid record select type");
		return next(null, "家长，您好：<br/>" + prompt);
    } else if (info.session.teacher) {
		info.wait("teacher kid record select type");
		return next(null, "老师，您好：<br/>" +prompt);
    } else {
        return next(null, "抱歉，您不是认证用户，不能发布成长记录！");
    }
}

function view_image(info, next) {
    var text = "抱歉，您不是认证用户，不能查看成长记录！";
    if (info.session.parent) {
        text = ejs.render(
            '家长，您好：<br/><a href="<%= url%>">请点击这里查看孩子成长记录</a>', 
            {
                //name: '小明',
                url: conf.site_root + '/record?shoolId=' + info.session.school.id +' &parentId=' + info.session.parent.id
            }
        )
    } else if (info.session.teacher) {
        text = ejs.render(
            '老师，您好：<br/><a href="<%= url%>">请点击这里查看孩子成长记录</a>', 
            {
                //name: '小明',
                url: conf.site_root + '/record?shoolId=' + info.session.school.id +' &teacherId=' + info.session.teacher.id
            }
        )
    }
    return next(null, text);
}

module.exports = function(webot) {
	// 发布成长记录提示语
	webot.set('user kid record add start by text', {
		domain: "gateway",
		pattern: /^(发布成长记录|(publish )?image)/i,
		handler: add_image_start
	});
	webot.set('user kid record add start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'KID_RECORD_ADD';
		},
		handler: add_image_start
	});

    // 查看成长记录
    webot.set('user kid record view start by text', {
        domain: "gateway",
        pattern: /^(查看成长记录|(view )?image|我的成长记录)/i,
        handler: view_image
    });
    webot.set('user kid record view start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'KID_RECORD_VIEW';
        },
        handler: view_image
    });
}