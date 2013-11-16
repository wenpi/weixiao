/**
 * Usage:
 * - 消息功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var MessageServices = require("../../services/MessageServices");

function add_message_start(info, next) {
    if (info.session.parent) {
        var prompt = "您发布的消息只有您本人和老师可阅读，需在" + conf.timeout.desc + "内完成该项操作，请输入文字：";
        return info.wait("parent message input");
    } else if (info.session.teacher) {
        var prompt = "您发布的消息全部家长都可以阅读，需在" + conf.timeout.desc + "内完成该项操作，请输入文字：";
        return info.wait("teacher message input");
    } else {
        return next(null, "抱歉，您不是认证用户，不能发布消息！");
    }
};

function view_message(info, next) {
    var text = "抱歉，您不是认证用户，不能查看消息！";
    if (info.session.parent) {
        text = ejs.render(
            '您有条<%= count%>未读消息。<br/><a href="<%= url%>">点击这里，立即查看</a>', 
            {
                count: 10,
                url: conf.site_root + '/message?shoolId' + info.session.school.id +' &parentId' + info.session.parent.id
            }
        )
    } else if (info.session.teacher) {
        text = ejs.render(
            '您有条<%= count%>未读消息。<br/><a href="<%= url%>">点击这里，立即查看</a>', 
            {
                count: 10,
                url: conf.site_root + '/message?shoolId' + info.session.school.id +' &teacherId' + info.session.teacher.id
            }
        )
    }
    return next(null, text);
}

module.exports = function(webot) {
    // 消息提示语
    webot.set('user message start by text', {
        domain: "user",
        pattern: /^(消息|(leave )?message)/i,
        handler: add_message_start
    });
    webot.set('user message start by event', {
        domain: "user",
        pattern: function(info) {
            return info.event === 'MESSAGE_ADD';
        },
        handler: add_message_start
    });

    // 查看消息
    webot.set('user message view start by text', {
        domain: "user",
        pattern: /^(查看消息|(view )?message|我的消息)/i,
        handler: view_message
    });
    webot.set('user message view start by event', {
        domain: "user",
        pattern: function(info) {
            return info.event === 'MESSAGE_VIEW';
        },
        handler: view_message
    });
}

/*
            MessageServices.query().then(function(messages) {
                next(null,
                    ejs.render(
                        '您有条<%= count%>未读消息。<a href="<%= url%>">查看</a>', 
                        {
                            count: messages.length,
                            url: conf.site_root + '/message?schoolOpenId' + info.sp +' &parentopenId' + info.uid
                        }
                    )
                );
            }, function() {
                // TODO
                next(null,
                    ejs.render(
                        '您有条<%= count%>未读消息。<a href="<%= url%>">查看</a>', 
                        {
                            count: messages.length,
                            url: conf.site_root + '/message?schoolOpenId' + info.sp +' &parentopenId' + info.uid
                        }
                    )
                );
            });
*/