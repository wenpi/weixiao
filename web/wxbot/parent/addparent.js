/**
 * Usage:
 * - 留言功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");
var wxconst = require("../const");
var MessageServices = require("../../services/MessageServices");
var UserServices = require("../../services/UserServices");

module.exports = function(webot) {
    // 等待手机号码输入
    webot.waitRule('add parent mobile input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.addparent;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add parent mobile input");
            return next(null, "抱歉，只能输入文字。");
        }
        if (!/^1(3|4|5|8)\d{9}$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("add parent mobile input");
            return next(null, "抱歉，只能输入手机号码。请重新输入：");
        }

        if (info.session.parent) {
            UserServices.queryByMobile(info.text).then(function() {
                info.rewait("add parent mobile input");
                return next(null, "抱歉，该手机号已经存在。请重新输入，如有疑问请联系IT管理员。");
            }, function() {
                info.session.parent.addparent = {
                    mobile: info.text
                };
                info.wait("add parent mobile confirm");
                return next(null, "请再次输入手机号码：");
            });
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });
    // 等待手机号码输入
    webot.waitRule('add parent mobile confirm', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.addparent;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add parent mobile input");
            return next(null, "抱歉，只能输入文字。");
        }
        if (!/^1(3|4|5|8)\d{9}$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("add parent mobile input");
            return next(null, "抱歉，只能输入手机号码。");
        }

        if (info.session.parent) {
            if (info.text !== info.session.parent.addparent.mobile) {
                utils.operation_is_failed(info, next);
                info.rewait("add parent mobile confirm");
                return next(null, "抱歉，两次输入手机号码不一致。请再次输入手机号码：");
            }
            info.wait("add parent name input");
            return next(null, "请输入家长姓名：");
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });
    // 等待家长名字录入
    webot.waitRule('add parent name input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.addparent;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add parent mobile input");
            return next(null, "抱歉，只能输入文字。");
        }

        if (info.session.parent) {
            info.session.parent.addparent.name = info.text;
            info.wait("add parent confirm");
            return next(null, "发送【" + wxconst.YES + "】确认\n发送【" + wxconst.NO + "】取消");
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });
    // 确认提交
    webot.waitRule('add parent confirm', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.addparent;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add parent confirm");
            return next(null, "抱歉，只能输入文字。");
        }

        if (info.session.parent) {
            // 接受提交指令
            if (info.text === wxconst.YES) {
                console.info(info.session.parent.addparent);
                return next(null, JSON.stringify(info.session.parent.addparent));
            } else  if (info.text === wxconst.NO) {
                delete info.session.parent.addparent;
            } else {
                utils.operation_is_failed(info, next);
                info.rewait("add parent confirm");
                return next(null, "抱歉！没有这个选项。");
            }
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });
}
