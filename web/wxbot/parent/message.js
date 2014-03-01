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

module.exports = function(webot) {
    /*
    // 等待留言输入
    webot.waitRule('parent message input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.messages;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("parent message input");
            return next(null, "抱歉，只能输入文字。");
        }
        if (info.session.parent) {
            // 接受提交指令
            if (info.text === wxconst.YES) {
                if (!info.session.parent.messages || info.session.parent.messages.length == 0) {
                    utils.operation_is_failed(info, next);
                    info.rewait("parent message input");
                    return next(null, "您还没输入文字，请留言：");
                }
                // 消息入库
                MessageServices.create(info.session.school.id, info.session.parent, {
                    title: '',
                    content: info.session.parent.messages.join(" "),
                    top: '0',
                    studentId: info.session.parent.students[0].id
                }).then(function() {
                    var text = ejs.render(
                        '留言已提交！\n<a href="<%- url%>">请点击这里查看留言</a>', 
                        {
                            url: conf.site_root + '/front/message' //?shoolId' + info.session.school.id +' &teacherId=' + info.session.teacher.id
                        }
                    );
                    return next(null, text);
                }, function() {
                    next(null, "抱歉，后台异常，无法提交留言。");
                });
                delete info.session.parent.messages;
                return;
            }
            // 接受取消指令
            if (info.text === wxconst.NO) {
                delete info.session.parent.messages;
                return next(null, "留言已取消，如需留言请再次点击【发布留言】。");
            }
            // 构造message
            if (!info.session.parent.messages) {
                info.session.parent.messages = [];
            }
            info.session.parent.messages.push(info.text);
            info.rewait("parent message input");
            return next(null, "已存成草稿，您可继续输入文字。\n\n发送【" + wxconst.YES + "】提交留言\n发送【" + wxconst.NO + "】取消");
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });
    */
}
