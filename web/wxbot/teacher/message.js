/**
 * Usage:
 * - 教师留言功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var MessageServices = require("../../services/MessageServices");

module.exports = function(webot) {
    // 等待留言输入
    webot.waitRule('teacher message input', function(info, next) {
        if (!info.is("text")) {
            info.rewait("teacher message input");
            return next(null, "抱歉，只能输入文字。");
        }
        if (info.session.teacher) {
            // 接受提交指令
            if (info.text === '好') {
                if (!info.session.teacher.messages || info.session.teacher.messages.length == 0) {
                    info.rewait("teacher message input");
                    return next(null, "您还没输入文字，请留言：");
                }
                // TODO 消息入库
                console.info(info.session.teacher.messages);
                delete info.session.teacher.messages;
                return next(null, "留言已提交！点击【留言板】查看留言最新状态。");
            }
            // 接受取消指令
            if (info.text === '不') {
                delete info.session.teacher.messages;
                return next(null, "留言已取消，如需留言请再次点击【发布留言】。");
            }
            // 构造message
            if (!info.session.teacher.messages) {
                info.session.teacher.messages = [];
            }
            info.session.teacher.messages.push(info.text);
            info.wait("teacher message input");
            return next(null, "已存成草稿，您可继续输入文字。发送【好】提交留言，发送【不】取消留言");
        }
    });
}