/**
 * Usage:
 * - 消息功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var UserServices = require("../../services/UserServices");

function add_leave_start(info, next) {
    if (info.session.parent) {
        info.wait("add leave parent date input");
    } else if (info.session.teacher) {
        next(null, '抱歉！该功能尚未为教师开放。');
    } else {
        return next(null, "抱歉，您不是认证用户，不能使用该功能。");
    }
};

module.exports = function(webot) {
    // 消息提示语
    webot.set('add leave start by text', {
        domain: "gateway",
        pattern: /^(请假|事假|病假|(add )?leave)/i,
        handler: add_leave_start
    });
    webot.set('add leave start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'LEAVE_ADD';
        },
        handler: add_leave_start
    });
}