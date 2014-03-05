/**
 * Usage:
 * - 修改密码功能
 * Author:
 * - hopesfish at 163.com
 */
var conf = require('../../conf');
var UserServices = require("../../services/UserServices");

function send_update(info, next) {
    var t = conf.online ? '' : (new Date()).getTime();

    // 发送信息
    function sendLinks(unread) {
        var messageUnread = '', photoUnread = '', pathUnread = '';
        /*
        if (unread.message !== undefined && unread.message > 0) {
            //messageUnread = ' ' + unread.message + '条未读';
        }
        if (unread.photo !== undefined && unread.photo > 0) {
            //photoUnread = ' ' + unread.photo + '张新图片';
        }
        if (unread.path !== undefined && unread.path > 0) {
            //pathUnread = ' ' + unread.path + '条新记录';
        }*/
        
        var user = info.session.parent || info.session.teacher;
        var schoolId = info.session.school.id;
        var rootUrl = conf.site_root + '/webot/wap/index.html?' + BaseServices.getAuthoriedParams(schoolId, users[0].id),
            messageUrl = rootUrl,
            noticeUrl = rootUrl,
            galleryUrl = rootUrl,
            pathUrl = rootUrl,
            leaveUrl = rootUrl,
            studentId, classId, leaveTitle = '我要请假';
    
        if (info.session.parent) {
            studentId = info.session.parent.students[0].id
            classId = info.session.parent.students[0].classId;

            messageUrl += '#/student/' + studentId + '/message';
            noticeUrl += '#/class/' + classId + '/notice';
            galleryUrl += '#/class/' + classId + '/gallery';
            pathUrl += '#/student/' + studentId + '/path';
            leaveUrl += '#/student/' + studentId + '/leave';
        } else if (info.session.teacher) {
            classId = info.session.teacher.wexClasses[0].classId;
 
            messageUrl += '#/class/' + classId + '/message';
            noticeUrl += '#/class/' + classId + '/notice';
            galleryUrl += '#/class/' + classId + '/gallery';
            pathUrl += '#/class/' + classId + '/path';
            leaveUrl += '#/class/' + classId + '/leave';
            leaveTitle = '请假考勤';
        }
        
        var links = [{
            title: '班级通知' + messageUnread,
            url: noticeUrl,
            picUrl: conf.site_root + '/webot/wap/images/webot/message.png?t=' + t,
            description: '通知' + messageUnread
        }, {
            title: '留言板',
            url: messageUrl,
            picUrl: conf.site_root + '/webot/wap/images/webot/index_1.jpg?t=' + t,
            description: '家长与老师的一对一沟通' + photoUnread
        }, {
            title: '班级圈' + photoUnread,
            url: galleryUrl,
            picUrl: conf.site_root + '/webot/wap/images/webot/index_2.jpg?t=' + t,
            description: '班级圈' + photoUnread
        }, {
            title: '成长记录' + photoUnread,
            url: pathUrl,
            picUrl: conf.site_root + '/webot/wap/images/webot/index_1.jpg?t=' + t,
            description: '班级相册' + photoUnread
        }, {
            title: leaveTitle,
            url: leaveUrl,
            picUrl: conf.site_root + '/webot/wap/images/webot/index_2.jpg?t=' + t,
            description: '请假考勤'
        }];

        
        links.push({
            title: '课程计划',
            url: conf.site_root + '/front/course',
            picUrl: conf.site_root + '/webot/wap/images/webot/index_3.jpg?t=' + t,
            description: '课程计划'
        });

        return next(null, links);
    }

    var userId = '';
    if (info.session.teacher) {
        userId = info.session.teacher.id;
    } else if (info.session.parent) {
        userId = info.session.parent.id;
    } else {
        return next(null, "当前用户不是家长或者老师。");
    }
    UserServices.queryUnread({userId: userId}).then(function(unread) {
        sendLinks(unread);
    }, function() {
        console.info("failed to get unread info.");
        sendLinks({});
    });
}

module.exports = function(webot) {
    webot.set('weexiao help by text', {
        domain: "gateway",
        pattern: /^(班级动态)/i,
        handler: send_update
    });
    webot.set('weexiao help by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'CLASS_UPDATE';
        },
        handler: send_update
    });
}