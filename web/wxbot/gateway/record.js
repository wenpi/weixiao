/**
 * Usage:
 * - 成长记录功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function add_image_start(info, next) {
	var prompt;
	if (info.session.parent) {
        prompt = "点击左下侧键盘图标后输入数字：\n\n回复【1】发布文字记录\n回复【2】发布照片记录";
		info.wait("parent kid record select type");
		return next(null, "" + prompt);
    } else if (info.session.teacher) {
        prompt = '请输入孩子名字，可全名，姓氏，名等。如输入"小明"的"明"。';
		info.wait("teacher kid record name prompt");
		return next(null, "" +prompt);
    } else {
        return next(null, "抱歉，您不是认证用户，不能发布成长记录！");
    }
}

function view_image(info, next) {
    var text = "抱歉，您不是认证用户，不能查看成长记录！";
    if (info.session.parent || info.session.teacher) {
        text = ejs.render(
            '<a href="<%- url%>">请点击这里查看成长记录</a>', 
            {
                //name: '小明',
                url: conf.site_root + '/studentPath/mobileView'
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