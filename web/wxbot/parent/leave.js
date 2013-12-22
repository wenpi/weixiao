/**
 * Usage:
 * - 留言功能
 * Author:
 * - hopesfish at 163.com
 */
require('date-utils');
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");
var wxconst = require("../const");
var UserServices = require("../../services/UserServices");
var LeaveServices = require("../../services/LeaveServices");

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
        if (/^[1-5]{1}$/i.test(info.text)) {
            var startDate = Date.today();
            startDate.setTime(Date.parse(info.session.parent.addleave.dates[parseInt(info.text) - 1]));
            info.session.parent.addleave.startDate = startDate;
        } else if (/^\d\d\d\d$/i.test(info.text)) {
            var startDate = Date.today();
            startDate.setTime(Date.parse(startDate.toFormat("YYYY") + '-' + info.text.substring(0, 2) + '-' + info.text.substring(2)));
            info.session.parent.addleave.startDate = startDate;
        } else {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent date input");
            return next(null, "抱歉，只能输入数字或者日期。请重新输入：");
        }

        if (utils.is_holiday(info.session.parent.addleave.startDate)) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent date input");
            return next(null, "抱歉，该日期是公共假日。请重新选择或者输入：");
        }

        if (info.session.parent) {
            info.session.parent.addleave.startDate = info.session.parent.addleave.startDate.toYMD();
            info.wait("add leave parent days input");
            return next(null, "请输入请假天数\n（1-31之间的数字）：");
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

        var days = parseInt(info.text, 10);

        if (isNaN(days)) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent days input");
            return next(null, "抱歉，只能输入数字。请重新输入：");
        }

        if (days <= 0 || days > 31) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent days input");
            return next(null, "抱歉！只能输入1至31之间的数字。请重新输入：");
        }

        if (info.session.parent) {
            var startDate = Date.today();
            startDate.setTime(Date.parse(info.session.parent.addleave.startDate));
            info.session.parent.addleave.startDate = startDate;
            if (days === 1) {
                info.session.parent.addleave.endDate = info.session.parent.addleave.startDate;
            } else {
                info.session.parent.addleave.endDate = info.session.parent.addleave.startDate.clone();
                info.session.parent.addleave.endDate = info.session.parent.addleave.endDate.addDays(days - 1);
            }
            info.session.parent.addleave.days = days;
            info.session.parent.addleave.startDate = info.session.parent.addleave.startDate.toYMD();
            info.session.parent.addleave.endDate = info.session.parent.addleave.endDate.toYMD();
            
            var prompt = [
                "请回复请假事由：",
                "【1】 事假",
                "【2】 病假",
            ];
            info.wait("add leave parent type input");
            return next(null, prompt.join("\n"));
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });
    // 请假类型
    webot.waitRule('add leave parent type input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.addleave;
            return next();
        }

        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent type input");
            return next(null, "抱歉，只能输入文字。");
        }

        if (!/^[1-2]{1}$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent type input");
            return next(null, "抱歉，没有这个选项。");
        }

        var select = parseInt(info.text, 10);

        if (info.session.parent) {
            info.session.parent.addleave.type = select;
            
            var prompt = [
                info.session.parent.addleave.type === 1 ? '请您输入备注信息：' : '请您输入病情信息：'
            ];
            info.wait("add leave parent reason input");
            return next(null, prompt.join("\n"));
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });   
    // 请假去儿呢
    webot.waitRule('add leave parent reason input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.addleave;
            return next();
        }

        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent reason input");
            return next(null, "抱歉，只能输入文字。");
        }

        if (info.session.parent) {
            info.session.parent.addleave.reason = info.text;
            
            var descLabel = info.session.parent.addleave.type === 1 ? '备注信息' : '病情信息';
            var prompt = [
                "请您确认请假信息：\n",
                "开始日期：" + info.session.parent.addleave.startDate,
                "结束日期：" + info.session.parent.addleave.endDate,
                "离园天数：" + info.session.parent.addleave.days,
                "离园理由：" + (info.session.parent.addleave.type === 1 ? '事假' : '病假'),
                descLabel + "：" + info.session.parent.addleave.reason,
                "\n发送【" + wxconst.YES + "】提交",
                "发送【" + wxconst.NO + "】取消"
            ];
            info.wait("add leave parent confirm");
            return next(null, prompt.join("\n"));
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    }); 
    // 请假类型
    webot.waitRule('add leave parent confirm', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.addleave;
            return next();
        }

        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent confirm");
            return next(null, "抱歉，只能输入文字。");
        }

        if (!/^[1-2]{1}$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent confirm");
            return next(null, "抱歉，没有这个选项。");
        }

        var select = parseInt(info.text, 10);

        if (info.session.parent) {
            var nostudent = '抱歉！查询您孩子信息时异常。请联系IT管理员！';
            var prompt = [
                select === 1 ? '请假已成功提交' : '已取消请假'
            ];
            if (select) {
                
                UserServices.queryStudentsAsParent({userId: info.session.parent.id, schoolOpenId: info.sp}).then(function(students) {
                    if (students.length === 0) {
                        return next(null, nostudent);
                    }

                    info.session.parent.addleave.schoolId = info.session.school.id;
                    info.session.parent.addleave.studentId = students[0].id;
                    info.session.parent.addleave.type = info.session.parent.addleave.type === 1 ? 1 : 0; // 0 
                    info.session.parent.addleave.createdBy = info.session.parent.id;

                    LeaveServices.addLeave(info.session.parent.addleave)
                    .then(function() {
                        return next(null, prompt.join("\n"));
                    }, function(err) {
                        return next(null, "抱歉！创建请假信息失败。");
                    })
                }, function(err) {
                    return next(null, nostudent);
                })
            } else {
                return next(null, prompt.join("\n"));
            }
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });   
}
