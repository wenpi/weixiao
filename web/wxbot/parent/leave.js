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

module.exports = function(webot) {
    // 等待日期输入
    webot.waitRule('add leave parent date input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.addleave;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent date input");
            return next(null, "抱歉，只能输入文字。");
        }
        if (!/^1(3|4|5|8)\d{9}$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent date input");
            return next(null, "抱歉，只能输入数字或者日期。请重新输入：");
        }

        if (info.session.parent) {
            info.wait("add leave parent days input");
            return next(null, "请输入请假天数：");
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });
    // 等待请假天数的录入
    webot.waitRule('add leave parent days input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.addleave;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent days input");
            return next(null, "抱歉，只能输入文字。");
        }

        var days = parseInt(info.text);

        if (isNaN(days)) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent days input");
            return next(null, "抱歉，只能输入数字。请重新输入：");
        }
        if (days <= 0 || days > 31) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent days input");
            return next(null, "抱歉，只能输入1-31。请重新输入：");
        }

        if (info.session.parent) {
            return next(null, "请假天数： " + days);
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });
}
