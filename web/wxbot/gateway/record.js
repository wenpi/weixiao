/**
 * Usage:
 * - 成长记录功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var TeacherServices = require("../../services/TeacherServices");

var selectkid = '请先选择你所在班级的一名孩子，点击左下侧键盘图标后，输入孩子姓名，可全名，也可以是姓名中的某个字。如输入“小明”的“明”。';

function add_image_start(info, next) {
	var prompt;
	if (info.session.parent) {
        prompt = "点击左下侧键盘图标后输入数字：\n\n回复【1】发布文字记录\n回复【2】发布照片记录";
		info.wait("parent kid record select type");
		return next(null, "" + prompt);
    } else if (info.session.teacher) {
        // 普通老师
        function selectKid() {
            prompt = selectkid;
            info.wait("teacher kid record name prompt");
            next(null, "" + prompt);
        }
        // 园长 管理员
        function stopSelect() {
            next(null, "抱歉，管理员无法使用该功能！");
        }
        // 判断是否是管理员
        if (info.session.teacher.isAdmin === 0) {
            return selectKid();
        } else if (info.session.teacher.isAdmin === 1) {
            return stopSelect();
        } else {
            TeacherServices.queryByUserId({userId: info.session.teacher.id}).then(function(teacher) {
                info.session.teacher.isAdmin = teacher.is_admin;
                if (info.session.teacher.isAdmin === 0) {
                    return selectKid();
                } else if (info.session.teacher.isAdmin === 1){
                    return stopSelect();
                }
            }, function(err) {
                return next(null, err);
            });
        }

    } else {
        return next(null, "抱歉，您不是认证用户，不能发布成长记录！");
    }
}

function view_image(info, next) {
    if (info.session.parent) {
        var text = ejs.render(
            '<a href="<%- url%>">请点击这里查看成长记录</a>', 
            {
                //name: '小明',
                url: conf.site_root + '/studentPath/mobileView'
            }
        )
        return next(null, text);
    }  else if (info.session.teacher) {
        // 普通老师
        function selectKid() {
            var prompt = selectkid;
            info.session.viewrecord = "teacher";
            info.wait("teacher kid record name prompt");
            next(null, "" + prompt);
        }
        // 园长 管理员
        function stopSelect() {
            next(null, "抱歉，孩子记录过多，不便在微信客户端浏览。请您在PC端上查看！");
        }
        // 判断是否是管理员
        if (info.session.teacher.isAdmin === 0) {
            return selectKid();
        } else if (info.session.teacher.isAdmin === 1) {
            return stopSelect();
        } else {
            TeacherServices.queryByUserId({userId: info.session.teacher.id}).then(function(teacher) {
                info.session.teacher.isAdmin = teacher.is_admin;
                if (info.session.teacher.isAdmin === 0) {
                    return selectKid();
                } else if (info.session.teacher.isAdmin === 1){
                    return stopSelect();
                }
            }, function(err) {
                return next(null, err);
            });
        }

    } else {
        return next(null, "抱歉，您不是认证用户，不能查看成长记录！");
    }
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