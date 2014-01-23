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
    if (info.session.teacher) {
        if (info.session.teacher.isAdmin === 1) {
            return next(null, "抱歉！园长，管理员暂时需通过PC端使用！");
        }
    }
    // 发送信息
    function sendLinks(unread) {
        var messageUnread = '', photoUnread = '', pathUnread = '';
        if (unread.message !== undefined && unread.message > 0) {
            messageUnread = ' ' + unread.message + '条未读';
        }
        if (unread.photo !== undefined && unread.photo > 0) {
            photoUnread = ' ' + unread.photo + '张新图片';
        }
        if (unread.path !== undefined && unread.path > 0) {
            pathUnread = ' ' + unread.path + '条新记录';
        }

        var links = [{
            title: '留言板' + messageUnread,
            url: conf.site_root + '/front/message',
            picUrl: conf.site_root + '/webot/wap/images/webot/message.png?t=' + t,
            description: '留言板' + messageUnread
        }, {
            title: '班级相册' + photoUnread,
            url: conf.site_root + '/classPhoto/mobileview',
            picUrl: conf.site_root + '/webot/wap/images/webot/photo.png?t=' + t,
            description: '班级相册' + photoUnread
        }];

        if (info.session.parent) {
            if (info.session.parent.students && info.session.parent.students.length > 0) {
                links.push({
                    title: '成长记录' + pathUnread,
                    url: conf.site_root + '/studentPath/mobileView?student_id=' + info.session.parent.students[0].id,
                    picUrl: conf.site_root + '/webot/wap/images/webot/record.png?t=' + t,
                    description: '成长记录' + pathUnread
                });
            }
        } else if (info.session.teacher) {
            if (info.session.teacher.isAdmin === 0 &&
                info.session.teacher.wxclasses &&
                info.session.teacher.wxclasses.length > 0) {
                links.push({
                    title: '成长记录' + pathUnread,
                    url: conf.site_root + '/webot/wap/school/' + info.session.school.id + "/class/" + info.session.teacher.wxclasses[0].id + "/record/entry",
                    picUrl: conf.site_root + '/webot/wap/images/webot/record.png?t=' + t,
                    description: '查看学生们的成长记录' + pathUnread
                });
            }
        }

        links.push({
            title: '课程计划',
            url: conf.site_root + '/front/course',
            picUrl: conf.site_root + '/webot/wap/images/webot/course.png?t=' + t,
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