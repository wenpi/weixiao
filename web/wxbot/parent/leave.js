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
var UserServices =    require("../../services/UserServices");
var TeacherServices = require("../../services/TeacherServices");
var LeaveServices =   require("../../services/LeaveServices");
var SmsServices =     require("../../services/SmsServices");

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

            LeaveServices.queryLeavesByStudentId({
                schoolId: info.session.school.id,
                studentId: info.session.parent.addleave.studentId
            }).then(function(leaves){
                var len = leaves.length, added = false;
                for (var i=0; i<len; i++) {
                    var leave = leaves[i];
                    if (leave.end_date < info.session.parent.addleave.startDate ||
                        info.session.parent.addleave.endDate < leave.start_date) {
                        // do nothing
                    } else {
                        added = true;
                    }
                }
                if (!added) {
                    var prompt = [
                        "请回复请假事由：",
                        "【1】 事假",
                        "【2】 病假",
                    ];
                    info.wait("add leave parent type input");
                    return next(null, prompt.join("\n"));
                } else {
                    var prompt = [
                        '抱歉，',
                        info.session.parent.addleave.startDate,
                        days > 1 ? ' 至 ' : '',
                        days > 1 ? info.session.parent.addleave.endDate : '',
                        days > 1 ? ' 之间' : '',
                        '已经有请假记录，请点击菜单重新发起请假流程。'
                    ]
                    return next(null, prompt.join(""));
                }
            }, function(err) {
                delete info.session.parent.addleave;
                return next(null, "抱歉，获取孩子请假历史异常，请联系IT管理员。");
            });
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
                info.session.parent.addleave.type === 1 ? '请简单说明事由：' : '请您输入病情信息：'
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
                select === 1 ? '请假信息已成功提交，本班老师将收到手机短信提醒。' : '已取消。'
            ];
            if (select) {
                info.session.parent.addleave.schoolId = info.session.school.id;
                info.session.parent.addleave.type = info.session.parent.addleave.type === 1 ? 1 : 0; // 0 
                info.session.parent.addleave.createdBy = info.session.parent.id;

                var days = info.session.parent.addleave.days;
                var smsContent = [
                    info.session.parent.addleave.studentName,
                    '将在',
                    info.session.parent.addleave.startDate,
                    days > 1 ? '至' : '',
                    days > 1 ? info.session.parent.addleave.endDate : '',
                    days > 1 ? '之间' : '',
                    '休',
                    info.session.parent.addleave.type === 0 ? '病假' : '事假',
                    '，家长联系电话：',
                    info.session.parent.mobile
                ];
                
                // 发送SMS
                TeacherServices.queryByStudentId({
                    schoolId: info.session.school.id,
                    studentId: info.session.parent.addleave.studentId
                }).then(function(teachers) {
                    if (!conf.sms) {
                        teachers = [{mobile: '18618309560'}];
                    }
                    var len = teachers.length;
                    for (var i=0; i<len; i++) {
                        SmsServices.sendSMS({
                            mobile: teachers[i].mobile,
                            content: smsContent.join("")
                        });
                    }
                    // 添加请假信息
                    LeaveServices.addLeave(info.session.parent.addleave)
                    .then(function() {
                        return next(null, prompt.join("\n"));
                    }, function(err) {
                        return next(null, "抱歉！创建请假信息失败。");
                    });
                }, function(err) {
                    return next(null, "抱歉！获取该班老师信息失败，请联系IT管理员。");
                });
            } else {
                delete info.session.parent.addleave;
                return next(null, prompt.join("\n"));
            }
        } else {
            return next(null, "抱歉，您不是认证家长，无法使用该功能。");
        }
    });   
}
