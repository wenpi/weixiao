/**
 * Usage:
 * - 修改个人资料
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");
var UserServices = require("../../services/UserServices");

function profile_edit(info, next) {
    var text = "抱歉，您不是认证用户，不能修改个人资料！";
    if (info.session.parent || info.session.teacher) {
        text = ejs.render(
            '<a href="<%- url%>">请点击这里修改个人资料</a>\n修改头像请回复图片：', 
            {
                url: conf.site_root + '/user/mobileMoreinfo?type=m'
            }
        )
    }
    info.wait("user profile image edit");
    return next(null, text);
}

module.exports = function(webot) {
    // 个人资料的网关
    webot.set('user profile gateway', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'PROFILE_GATEWAY';
        },
        handler: function(info, next) {
            info.wait("user profile action");
            return next(null, [
                    "请回复数字选择您要进行的操作：",
                    "【1】修改个人资料",
                    "【2】修改密码",
                    "【3】添加家长",
                    ""
                ].join("\n"));
        }
    });
    // 个人资料的选择
    webot.waitRule("user profile action", function(info, next) {
        if (info.is("event")) {
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("user profile action");
            return next(null, "抱歉，只能输入文字。");
        }
        if (!/^(1|2|3)$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("user profile action");
            return next(null, "抱歉，没有这个选项，请重新输入：");
        }
        var action = info.text + '';
        switch(action) {
        case '1':
            info.param.eventKey = 'PROFILE_EDIT';
        break;
        case '2':
            info.param.eventKey = 'PASSWORD_EDIT';
        break;
        case '3':
            info.param.eventKey = 'PARENT_ADD';
        break;
        }
        return next();
    });
	// 修改个人资料提示语
	webot.set('user profile edit start by text', {
		domain: "gateway",
		pattern: /^(修改个人资料|(edit )?profile)/i,
		handler: profile_edit
	});
	webot.set('user profile edit start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'PROFILE_EDIT';
		},
		handler: profile_edit
	});

    webot.waitRule('user profile image edit', function(info, next) {
        if (info.is("event")) {
            return next();
        }
        if (!info.is("image")) {
            info.rewait("user profile image edit");
            return next(null, "抱歉，只能上传图片。");
        }else {
            var user = info.session.parent || info.session.teacher;
            var mobile = user.mobile || 'unknown';
            var filename = 'user/' + mobile + '/profile/' + (new Date()).getTime();
            utils.download_image(info.param.picUrl, filename, function() {
                UserServices.updateProfileImage({id: user.id, profileImage: filename}).then(function() {
                    var text = ejs.render(
                        '更新头像成功！\n<a href="<%- url%>">点击这里查看个人资料</a>', 
                        {
                            url: conf.site_root + '/user/mobileMoreinfo?type=m'
                        }
                    );
                    return next(null, text);
                }, function() {
                    next(null, "抱歉，后台异常，无法更新头像。");
                });
            });
        }
    });
}