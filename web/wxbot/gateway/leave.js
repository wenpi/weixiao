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
var BaseServices = require("../../services/BaseServices");
var UserServices = require("../../services/UserServices");

function add_leave_start(info, next) {
    if (info.session.parent) {
        var nostudent = '抱歉！获取您孩子信息时异常。请联系IT管理员！';
        info.session.parent.addleave = {dates: []};

        var students = info.session.parent.students;

        if (students.length === 0) {
            return next(null, nostudent);
        }

        info.session.parent.addleave.studentName = students[0].name;
        info.session.parent.addleave.studentId = students[0].id;

        var text = ["请回复数字选择【开始日期】或者直接回复【开始日期】，如6月1日则回复四位数字0601（备注：四位数字所表示的日期为当年日期）："];
        var date = Date.today();
        
        while (text.length < 6) {
            if (!utils.is_holiday(date)) {
                text.push('【' + text.length + '】 ' + date.toYMD());
                info.session.parent.addleave.dates.push(date.toYMD());
            }
            date = date.clone();
            date.addDays(1);
        }
        info.wait("add leave parent date input");
        next(null, text.join("\n"));
            
    } else if (info.session.teacher) {
        if (info.session.teacher.isAdmin === 1) {
            return next(null, "抱歉！园长，管理员暂时需通过PC端使用！");
        } else {
            var schoolId = info.session.school.id;
            var userId = info.session.teacher.id;
            var url = conf.site_root + '/webot/wap/index?' + BaseServices.getAuthoriedParams(schoolId, userId) + '#/leave';
            return next(null,  {
                title: '考勤管理',
                url: url,
                picUrl: conf.site_root + '/webot/wap/images/webot/webanner.jpg',
                description: '查看，编辑学生考勤记录',
            });
        }
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