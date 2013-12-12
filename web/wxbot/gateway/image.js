/**
 * Usage:
 * - 图片功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var TeacherServices = require("../../services/TeacherServices");

function add_image_start(info, next) {
	var prompt = [
        "通过这里上传的图片将直接显示在班级相册中，仅本班所有家长及老师可见。\n\n",
        "上传照片前，请先输入主题文字，简单描述一下您要发布的照片内容。\n\n",
        "例如“和孩子一起读书” “集体户外游戏小青蛙跳荷叶”等，需在",
        conf.timeout.desc,
        "内完成该项操作。\n\n请点击左下侧键盘图标后输入照片主题："].join("");

    function sendPrompt() {
        info.wait("teacher image input text");
        next(null, '' + prompt);
    }
    function sendStop() {
        next(null, '抱歉，管理员无法使用该功能。');
    }

	if (info.session.parent) {
		info.wait("parent image input text");
		return next(null, '' + prompt);
    } else if (info.session.teacher) {
        if (info.session.teacher.isAdmin === 0) {
            return sendPrompt();
        } else if (info.session.teacher.isAdmin === 1){
            return sendStop();
        } else {
            TeacherServices.queryByUserId({userId: info.session.teacher.id}).then(function(teacher) {
                info.session.teacher.isAdmin = teacher.is_admin;
                if (info.session.teacher.isAdmin === 0) {
                    return sendPrompt();
                } else if (info.session.teacher.isAdmin === 1){
                    return sendStop();
                }
            }, function(err) {
                return next(null, err);
            });
        }
    } else {
        return next(null, "抱歉，您不是认证用户，不能发布图片！");
    }
}

function view_image(info, next) {
    var text = "抱歉，您不是认证用户，不能查看图片！";

    function sendLink() {
        text = ejs.render(
            '<a href="<%- url%>">请点击这里查看相册</a>', 
            {
                //name: '小一班',
                url: conf.site_root + '/classPhoto/mobileview'
            }
        )
        next(null, text);
    };
    function sendLinks() {
        text = ejs.render(
            '<a href="<%- url%>">园长查看相册</a>', 
            {
                //name: '小一班',
                url: conf.site_root + '/classPhoto/mobileview'
            }
        )
        next(null, text);
    };

    if (info.session.parent) {
        return sendLink();
    } else if (info.session.teacher) {
        if (info.session.teacher.isAdmin === 0) {
            return sendLink();
        } else if (info.session.teacher.isAdmin === 1){
            return sendLinks();
        } else {
            TeacherServices.queryByUserId({userId: info.session.teacher.id}).then(function(teacher) {
                info.session.teacher.isAdmin = teacher.is_admin;
                if (info.session.teacher.isAdmin === 0) {
                    return sendLink();
                } else if (info.session.teacher.isAdmin === 1){
                    return sendLinks();
                }
            }, function(err) {
                return next(null, err);
            });
        }
    } else {
        return next(null, text);
    }
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
			return info.param.eventKey === 'IMAGE_ADD';
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
            return info.param.eventKey === 'IMAGE_VIEW';
        },
        handler: view_image
    });
}