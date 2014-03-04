/**
 * Usage:
 * - 修改个人资料
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");
var wxconst = require("../const");
var BaseServices = require("../../services/BaseServices");
var UserServices = require("../../services/UserServices");
var ParentServices = require("../../services/ParentServices");

module.exports = function(webot) {
    // 个人资料的网关
    function profile_gateway(info, next) {
        var user = info.session.parent || info.session.teacher;
        var url = conf.site_root + '/webot/wap/index.html?' + 
            BaseServices.getAuthoriedParams(info.session.school.id, user.id);

        info.wait("user profile action");
        return next(null, [
                '使用网页版设置请\n<a href="' + url + '">点击这里</a>\n',
                "使用微信对话框设置请回复数字：",
                "【1】修改个人资料",
                "【2】修改头像",
                "【3】修改密码",
                "【4】添加家长",
            ].join("\n"));
    }

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

        if (!/^(1|2|3|4)$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("user profile action");
            return next(null, "抱歉，没有这个选项，请重新输入：");
        }
        switch(info.text + '') {
        case '1':
            info.param.eventKey = 'PROFILE_EDIT';
        break;
        case '2':
            info.param.eventKey = 'PROFILE_IMAGE_EDIT';
        break;
        case '3':
            info.param.eventKey = 'PROFILE_PASSWORD_EDIT';
        break;
        case '4':
            info.param.eventKey = 'PARENT_ADD';
        break;
        }
        return next();
    });

    webot.set('user profile edit start by text', {
        domain: "gateway",
        pattern: /^(个人资料)/i,
        handler: profile_gateway
    });
    webot.set('user profile gateway', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'PROFILE_GATEWAY';
        },
        handler: profile_gateway
    });



    // 返回个人资料链接
    function profile_edit(info, next) {
        var user = info.session.parent || info.session.teacher;
        if (user) {
            return next(null, ejs.render(
                '请<a href="<%- url%>">点击这里</a>修改个人资料', 
                {
                    url: conf.site_root + '/webot/wap/index.html?' + 
                            BaseServices.getAuthoriedParams(info.session.school.id, user.id) +
                            '#/user/' + user.id
                }
            ));
        } else {
            return next(null, "抱歉，您不是认证用户，不能修改个人资料！");
        }
    }

    // 修改个人资料提示语
    webot.set('user profile edit start by text', {
        domain: "gateway",
        pattern: /^(修改个人资料)/i,
        handler: profile_edit
    });
    webot.set('user profile edit start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'PROFILE_EDIT';
        },
        handler: profile_edit
    });



    // 修改个人头像
    function profile_image_edit(info, next) {
        if (info.session.parent || info.session.teacher) {
            info.wait("user profile image edit");
            return next(null, "请上传头像：");
        } else {
            return next(null, "抱歉，您不是认证用户，不能修改头像！");
        }
    }
    webot.waitRule('user profile image edit', function(info, next) {
        if (info.is("event")) {
            return next();
        }

        if (!info.is("image")) {
            info.rewait("user profile image edit");
            return next(null, "抱歉，只能上传图片。");
        }

        var schoolId = info.session.school.id,
            user = info.session.parent || info.session.teacher,
            filename = '/school/' + schoolId + '/user/' + user.id + '/profile';

        utils.download_image(info.param.picUrl, filename, function() {
            UserServices.update(schoolId, user.id, {
                photo: filename,
            }).then(function() {
                return next(null, '更新头像成功');
            }, function(err) {
                return next(null, "更新头像失败，请联系管理员。");
            });
        }, function() {
            return next(null, "写入头像文件失败，请联系管理员。");
        });
    });
    webot.set('user profile image edit start by text', {
        domain: "gateway",
        pattern: /^(修改头像)/i,
        handler: profile_image_edit
    });
    webot.set('user profile image edit start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'PROFILE_IMAGE_EDIT';
        },
        handler: profile_image_edit
    });



    // 修改密码
    function profile_password_edit(info, next) {
        if (info.session.parent || info.session.teacher) {
            info.wait("user profile password type old password");
            return next(null, "请输入旧密码：");
        } else {
            return next(null, "抱歉，您不是认证用户，不能修改头像！");
        }
    }
    webot.waitRule('user profile password type old password', function(info, next) {
        if (info.is("event")) {
            return next();
        }

        if (!info.is("text")) {
            info.rewait("user profile password type old password");
            return next(null, "抱歉，只能输入文字。");
        }

        info.session.oldPassword = info.text;
        info.wait("user profile password type new password");
        return next(null, "请输入新密码（至少4位）：");
    });
    webot.waitRule('user profile password type new password', function(info, next) {
        function clear() {
            delete info.session.oldPassword;
        }

        if (info.is("event")) {
            clear();
            return next();
        }

        if (!info.is("text")) {
            info.rewait("user profile password type new password");
            return next(null, "抱歉，只能输入文字。");
        }

        if (info.text.length < 4) {
            info.rewait("user profile password type new password");
            return next(null, "抱歉，请输入至少4位密码。");
        }

        var schoolId = info.session.school.id,
            user = info.session.parent || info.session.teacher;

        UserServices.update(schoolId, user.id, {
            oldPassword: info.session.oldPassword,
            password: info.text
        }).then(function() {
            return next(null, '更新密码成功，请删除上一条消息（长按）以保证信息安全。');
        }, function(err) {
            return next(null, "更新密码失败，请联系管理员。");
        });
        clear();
    });
    webot.set('user profile password edit start by text', {
        domain: "gateway",
        pattern: /^(修改密码)/i,
        handler: profile_password_edit
    });
    webot.set('user profile password edit start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'PROFILE_PASSWORD_EDIT';
        },
        handler: profile_password_edit
    });



    // 添加家长
    function profile_parent_add(info, next) {
        if (info.session.parent) {
            if (!info.session.parent.students ||
                (info.session.parent.students && info.session.parent.students.length != 1)) {
                return next(null, "孩子数据异常，无法继续。");
            }

            ParentServices.queryParentsByStudent({
                schoolId: info.session.school.id, 
                studentId: info.session.parent.students[0].id
            }).then(function(parents) {
                var contacts = [], prompt;
                for (var i=0; i<parents.length; i++) {
                    contacts.push(parents[i].name + ' ' + parents[i].mobile);
                }

                if (parents.length >= 10) {
                    return next(null, "抱歉！已达上限，无法再添加家长。当前家长列表：\n" + contacts.join("\n"));
                }

                info.wait("add parent mobile input");
                var prompt = [
                    "现有认证家长 " + contacts.length + " 名:\n",
                    contacts.join("\n") + '\n',
                    '请点击左下角键盘后输入其他家长的手机号：'
                ];
                return next(null, prompt.join("\n"));
            }, function(err) {
                return next(null, "抱歉，获取家长列表异常！无法添加家长，请联系老师。");
            });
        } else if (info.session.teacher) {
            return next(null, ejs.render(
                '教师用户请<a href="<%- url%>">点击这里</a>使用网页版添加。', 
                {
                    url: conf.site_root + '/webot/wap/index.html?' + 
                            BaseServices.getAuthoriedParams(info.session.school.id, info.session.teacher.id)
                }
            ));
        } else {
            return next(null, "抱歉，您不是认证用户，不能添加家长！");
        }
    }
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
            UserServices.query({
                schoolId: info.session.school.id,
                mobile: info.text
            }).then(function(users) {
                if (users.length > 0) {
                    info.rewait("add parent mobile input");
                    return next(null, "抱歉，该手机号已经存在。请重新输入，如有疑问请联系IT管理员。");
                }
                info.session.parent.addparent = {
                    mobile: info.text
                };
                info.wait("add parent mobile confirm");
                return next(null, "请再次输入手机号码：");
            }, function() {
                delete info.session.parent.addparent;
                return next(null, "查询手机号是否存在出现异常。请联系IT管理员。");
            });
        } else {
            return next(null, "抱歉，您不是家长，无法使用该功能。");
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
                "\n回复【" + wxconst.YES + "】确认\n回复【" + wxconst.NO + "】取消"
            ];
            return next(null, pompt.join("\n"));
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
                var students = info.session.parent.students;

                if (students.length === 0) {
                    return next(null, "抱歉！查询您孩子信息时异常。请联系IT管理员");
                }

                info.session.parent.addparent.schoolId = info.session.school.id;
                info.session.parent.addparent.studentId = students[0].id;
                info.session.parent.addparent.photo = info.session.parent.photo;
                info.session.parent.addparent.createdBy = info.session.parent.id;

                ParentServices.createParentByParent(info.session.parent.addparent)
                .then(function() {
                    return next(null, "添加成功！请使用另一个微信账号激活，初始密码为新手机号码的后四位。");
                }, function(err) {
                    return next(null, "抱歉！创建失败。");
                });
                delete info.session.parent.addparent;
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
    webot.set('user profile image edit start by text', {
        domain: "gateway",
        pattern: /^(添加家长)/i,
        handler: profile_parent_add
    });
    webot.set('user profile image edit start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'PARENT_ADD';
        },
        handler: profile_parent_add
    });
}