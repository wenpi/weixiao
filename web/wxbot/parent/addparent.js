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
var ParentServices = require("../../services/ParentServices");

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
            info.rewait("add parent mobile confirm");
            return next(null, "抱歉，只能输入文字。");
        }
        if (!/^1(3|4|5|8)\d{9}$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("add parent mobile confirm");
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
            info.rewait("add parent name input");
            return next(null, "抱歉，只能输入文字。");
        }

        if (info.session.parent) {
            info.session.parent.addparent.name = info.text;
            info.wait("add parent confirm");
            var pompt = [
                "请确认新家长的信息：\n",
                "手机号码：" + info.session.parent.addparent.mobile,
                "家长姓名：" + info.session.parent.addparent.name,
                "\n发送【" + wxconst.YES + "】确认\n发送【" + wxconst.NO + "】取消"
            ];
            return next(null, pompt.join("\n"));
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });
    // 确认提交
    webot.waitRule('add parent confirm', function(info, next) {
        var nostudent = '抱歉！查询您孩子信息时异常。请联系IT管理员！';
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
                UserServices.queryStudentsAsParent({userId: info.session.parent.id, schoolOpenId: info.sp}).then(function(students) {
                    if (students.length === 0) {
                        return next(null, nostudent);
                    }

                    info.session.parent.addparent.schoolId = info.session.school.id;
                    info.session.parent.addparent.studentId = students[0].id;
                    info.session.parent.addparent.photo = info.session.parent.photo;
                    info.session.parent.addparent.createdBy = info.session.parent.id;

                    ParentServices.createParentByParent(info.session.parent.addparent)
                    .then(function() {
                        return next(null, "添加成功！您现在可以用\n\n手机号码：" + info.session.parent.addparent.mobile + "\n\n激活另一个微信账号。");
                    }, function(err) {
                        return next(null, "抱歉！创建失败。");
                    })
                }, function(err) {
                    return next(null, nostudent);
                })
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
