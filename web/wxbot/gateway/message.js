/**
 * Usage:
 * - 消息功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var wxconst = require("../const");
var utils = require("../utils");
var BaseServices = require("../../services/BaseServices");
var MessageServices = require("../../services/MessageServices");

function add_message_start(info, next) {
    if (!info.session.parent && !info.session.teacher) {
        return next(null, "当前用户无法提交留言内容。");
    }

    if (info.session.parent) {
        info.wait("user message input");
        return next(null, ejs.render(
            '请点击左下侧键盘图标后输入您想对老师说的话，仅有您的家庭成员和本班老师可见。如需使用网页版，请<a href="<%- url%>">点击这里</a>：', 
            {
                url: conf.site_root + '/webot/wap/index.html?' + 
                        BaseServices.getAuthoriedParams(info.session.school.id, info.session.parent.id)
            }
        ));
    } else if (info.session.teacher) {
        if (info.session.teacher.isAdmin === 0) {
            info.wait("user message input");
            return next(null, ejs.render(
                '请点击左下侧键盘图标后输入通知内容。如需使用网页版，请<a href="<%- url%>">点击这里</a>：', 
                {
                    url: conf.site_root + '/webot/wap/index.html?' + 
                            BaseServices.getAuthoriedParams(info.session.school.id, info.session.teacher.id)
                }
            ));
        } else if (info.session.teacher.isAdmin === 1){
            return next(null, ejs.render(
                '园长，管理员用户请<a href="<%- url%>">点击这里</a>使用网页版。', 
                {
                    url: conf.site_root + '/webot/wap/index.html?' + 
                            BaseServices.getAuthoriedParams(info.session.school.id, info.session.teacher.id)
                }
            ));
        }
    }
};

function view_message(info, next) {
    var user = info.session.parent || info.session.teacher;
    return next(null, ejs.render(
        '请<a href="<%- url%>">点击这里</a>查看', 
        {
            url: conf.site_root + '/webot/wap/index.html?' + 
                    BaseServices.getAuthoriedParams(info.session.school.id, user.id)
        }
    ));
}

module.exports = function(webot) {
    // 消息提示语
    webot.set('user message start by text', {
        domain: "gateway",
        pattern: /^(添加消息)/i,
        handler: add_message_start
    });
    webot.set('user message start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'MESSAGE_ADD';
        },
        handler: add_message_start
    });

    webot.waitRule('user message input', function(info, next) {
        function clear() {
            delete info.session.messages;
        }

        if (info.is("event")) {
            clear();
            return next();
        }

        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("user message input");
            return next(null, "抱歉，只能输入文字。");
        }

        if (!info.session.parent && !info.session.teacher) {
            clear();
            return next(null, "当前用户无法提交留言内容。");
        }

        var user = info.session.parent || info.session.parent;
 
        // 取消指令
        if (info.text === wxconst.NO) {
            clear();
            return next(null, "留言已取消，如需留言请点击菜单。");
        }

        if (info.session.parent) {
            if (info.session.parent.students.length > 1 ||info.session.parent.students.length == 0) {
                return next(null, "抱歉，您在本园的孩子数量超过1名或者孩子信息异常，无法继续本操作。");
            }
        }

        // 接受提交指令
        if (info.text === wxconst.YES) {
            if (!info.session.messages || info.session.messages.length == 0) {
                utils.operation_is_failed(info, next);
                info.rewait("parent message input");
                return next(null, "您还没输入文字，请留言：");
            }
            // 消息入库
            var data = {
                title: '',
                content: info.session.messages.join(" "),
                top: '0',
                createdBy: info.session.parent.id
            }, url;

            if (info.session.parent) {
                data.studentId = info.session.parent.students[0].id;
                url = conf.site_root + '/webot/wap/index.html?' + 
                    BaseServices.getAuthoriedParams(info.session.parent.students[0].classId, info.session.parent.id) +
                    '#/student/' + info.session.parent.students[0].id + '/message'
            }

            MessageServices.create(info.session.parent.students[0].classId, data).then(function() {
                return next(null, ejs.render(
                    '成功提交留言，请<a href="<%- url%>">点击这里</a>查看我的留言。', 
                    {
                        url: url
                    }
                ));
            }, function(err) {
                console.info(err);
                return next(null, "抱歉，后台异常，无法提交留言。");
            });
            return clear();
        }

        // 构造message
        if (!info.session.messages) {
            info.session.messages = [];
        }
        info.session.messages.push(info.text);
        info.rewait("user message input");
        return next(null, "已存成草稿，您可继续输入文字。\n\n发送【" + wxconst.YES + "】提交留言\n发送【" + wxconst.NO + "】取消");
    });

    // 查看消息
    webot.set('user message view start by text', {
        domain: "gateway",
        pattern: /^(查看消息)/i,
        handler: view_message
    });
    webot.set('user message view start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'MESSAGE_VIEW';
        },
        handler: view_message
    });
}