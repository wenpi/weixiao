/**
 * Usage:
 * - 消息功能
 * Author:
 * - hopesfish at 163.com
 */
require('date-utils');
var ejs = require('ejs');
var utils = require("../utils");
var conf = require('../../conf');
var wxconst = require("../const");
var BaseServices = require("../../services/BaseServices");
var UserServices = require("../../services/UserServices");
var LeaveServices =   require("../../services/LeaveServices");

function add_leave_start(info, next) {
    if (info.session.parent) {
        info.session.parent.leave = {dates: []};

        var studentId = info.session.parent.students[0].id;
        var route = '#/student/' + studentId + '/leave';
        var url = ejs.render(
            '<a href="<%- url%>">点击这里</a>使用网页版提交请假申请\n', 
            {
                url: conf.site_root + '/webot/wap/index.html?' + 
                        BaseServices.getAuthoriedParams(info.session.school.id, info.session.parent.id) +
                        route
            }
        );
        var prompt = [url + "您也可以回复数字选择【开始日期】或者直接回复【开始日期】，如6月1日则回复四位数字0601（备注：四位数字所表示的日期为当年日期）："];

        var date = Date.today();
        while (prompt.length < 6) {
            if (!utils.is_holiday(date)) {
                prompt.push('【' + prompt.length + '】 ' + date.toYMD());
                info.session.parent.leave.dates.push(date.toYMD());
            }
            date = date.clone();
            date.addDays(1);
        }

        info.wait("add leave parent date input");
        return next(null, prompt.join("\n"));
    } else if (info.session.teacher) {
        var classId = info.session.teacher.wexClasses[0].id;
        var route = '#/class/' + classId + '/leave';

        return next(null, ejs.render(
            '请<a href="<%- url%>">点击这里</a>使用网页版管理考勤', 
            {
                url: conf.site_root + '/webot/wap/index.html?' + 
                        BaseServices.getAuthoriedParams(info.session.school.id, info.session.teacher.id) +
                        route
            }
        ));
    } else {
        return next(null, "抱歉，您不是认证用户，不能使用该功能。");
    }
};

module.exports = function(webot) {
    // 等待日期输入
    webot.waitRule('add leave parent date input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.leave;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent date input");
            return next(null, "抱歉，只能输入文字。");
        }

        if (/^[1-5]{1}$/i.test(info.text)) {
            var startDate = Date.today();
            startDate.setTime(Date.parse(info.session.parent.leave.dates[parseInt(info.text) - 1]));
            info.session.parent.leave.startDate = startDate;
        } else if (/^(0\d{1}|1[0-2])(0\d{1}|[12]\d{1}|3[01])$/i.test(info.text)) {
            var startDate = Date.today();
            startDate.setTime(Date.parse(startDate.toFormat("YYYY") + '-' + info.text.substring(0, 2) + '-' + info.text.substring(2)));
            info.session.parent.leave.startDate = startDate;
        } else {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent date input");
            return next(null, "抱歉，只能输入数字或者日期。请重新输入：");
        }

        if (utils.is_holiday(info.session.parent.leave.startDate)) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent date input");
            return next(null, "抱歉，该日期是公共假日。请重新选择或者输入：");
        }

        info.session.parent.leave.startDate = info.session.parent.leave.startDate.toYMD();
        info.wait("add leave parent days input");
        return next(null, "请输入请假天数\n（1-31之间的数字）：");
    });
    // 等待请假天数的录入
    webot.waitRule('add leave parent days input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.leave;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent days input");
            return next(null, "抱歉，只能输入文字。");
        }

        if (!/^([1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1})$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent days input");
            return next(null, "抱歉！只能输入1至31之间的数字。请重新输入：");
        }
        
        var days = parseInt(info.text, 10);

        var startDate = Date.today();
        startDate.setTime(Date.parse(info.session.parent.leave.startDate));
        info.session.parent.leave.startDate = startDate;
        if (days === 1) {
            info.session.parent.leave.endDate = info.session.parent.leave.startDate;
        } else {
            info.session.parent.leave.endDate = info.session.parent.leave.startDate.clone();
            info.session.parent.leave.endDate = info.session.parent.leave.endDate.addDays(days - 1);
        }
        info.session.parent.leave.days = days;
        info.session.parent.leave.startDate = info.session.parent.leave.startDate.toYMD();
        info.session.parent.leave.endDate = info.session.parent.leave.endDate.toYMD();

        LeaveServices.queryLeavesByStudentId({
            schoolId: info.session.school.id,
            studentId: info.session.parent.students[0].id
        }).then(function(leaves){
            var len = leaves.length, added = false;
            for (var i=0; i<len; i++) {
                var leave = leaves[i];
                if (leave.endDate < info.session.parent.leave.startDate ||
                    info.session.parent.leave.endDate < leave.startDate) {
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
                    info.session.parent.leave.startDate,
                    days > 1 ? ' 至 ' : '',
                    days > 1 ? info.session.parent.leave.endDate : '',
                    days > 1 ? ' 之间' : '',
                    '已经有请假记录，请重新申请。'
                ]
                return next(null, prompt.join(""));
            }
        }, function(err) {
            delete info.session.parent.leave;
            return next(null, "抱歉，获取请假历史信息异常，请联系IT管理员。");
        });
    });
    // 请假类型
    webot.waitRule('add leave parent type input', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.leave;
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
            info.session.parent.leave.type = select;
            
            var prompt = [
                info.session.parent.leave.type === 1 ? '请简单说明事由：' : '请您输入病情信息：'
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
            delete info.session.parent.leave;
            return next();
        }

        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("add leave parent reason input");
            return next(null, "抱歉，只能输入文字。");
        }

        info.session.parent.leave.reason = info.text;

        var descLabel = info.session.parent.leave.type === 1 ? '备注信息' : '病情信息';
        var prompt = [
            "请您确认请假信息：\n",
            "开始日期：" + info.session.parent.leave.startDate,
            "结束日期：" + info.session.parent.leave.endDate,
            "离园天数：" + info.session.parent.leave.days,
            "离园理由：" + (info.session.parent.leave.type === 1 ? '事假' : '病假'),
            descLabel + "：" + info.session.parent.leave.reason,
            "\n回复【" + wxconst.YES + "】提交",
            "回复【" + wxconst.NO + "】取消"
        ];
        info.wait("add leave parent confirm");
        return next(null, prompt.join("\n"));
    }); 
    // 请假类型
    webot.waitRule('add leave parent confirm', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.leave;
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

        if (info.text == wxconst.YES) {
            info.session.parent.leave.schoolId = info.session.school.id;
            info.session.parent.leave.type = info.session.parent.leave.type === 1 ? 1 : 0; // 0 
            info.session.parent.leave.createdBy = info.session.parent.id;

            // 添加请假信息
            LeaveServices.create(
                info.session.school.id, 
                info.session.parent.students[0].id,
                info.session.parent.leave
            ).then(function() {
                var studentId = info.session.parent.students[0].id;
                var route = '#/student/' + studentId + '/leave';

                return next(null, ejs.render(
                    '操作成功！请<a href="<%- url%>">点击这里</a>使用查看考勤历史', 
                    {
                        url: conf.site_root + '/webot/wap/index.html?' + 
                                BaseServices.getAuthoriedParams(info.session.school.id, info.session.parent.id) +
                                route
                    }
                ));
            }, function(err) {
                return next(null, "抱歉！操作失败。");
            });
        } else {
            delete info.session.parent.leave;
            return next(null, "操作已取消");
        }
    });

    // 消息提示语
    webot.set('add leave start by text', {
        domain: "gateway",
        pattern: /^(请假|事假|病假|考勤)/i,
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