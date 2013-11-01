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
        var prompt = "通过这里输入的文字将直接显示在班级留言板上，仅有您和老师可见，需在" + conf.timeout.desc + "内完成该项操作。\n\n请点击左下侧键盘图标后输入你想对老师说的话：";
        info.wait("parent message input");
        return next(null, prompt);
    } else if (info.session.teacher) {
        var prompt = "通过这里输入的文字将直接显示在班级留言墙上，您所在班级所有家长和老师可见，需在" + conf.timeout.desc + "内完成该项操作。\n\n请点击左下侧键盘图标后输入您想对家长们说的话：";
        
        function sendPrompt() {
            info.wait("teacher message input");
            next(null, '' + prompt);
        }
        function sendStop() {
            next(null, '抱歉！园长，管理员无法使用该功能。');
        }
        if (info.session.teacher.isAdmin === 0) {
            return sendPrompt();
        } else if (info.session.teacher.isAdmin === 1){
            return sendStop();
        }

    } else {
        return next(null, "抱歉，您不是认证用户，不能发布消息！");
    }
};

function view_message(info, next) {
    if (info.session.parent === undefined && info.session.teacher === undefined) {
        return next(null, "抱歉，您不是认证用户，不能查看消息！");
    }

    var user;

    function sendLink() {
       MessageServices.query(user).then(function(count) {
            var text =  ejs.render(
                '<% if (count !== 0) { %>您有<%= count%>条未读消息。\n<%}%><a href="<%- url%>">请点击这里查看消息</a>', 
                {
                    count: count,
                    url: conf.site_root + '/front/message'
                }
            )
            next(null, text);
        }, function(err) {
            var text =  ejs.render(
                '后台异常，无法查询未读消息条目。\n<a href="<%- url%>">请点击这里查看消息</a>', 
                {
                    url: conf.site_root + '/front/message'
                }
            )
            next(null, text);
        });
    }

    function sendLinks() {
        var text = '请点击下列链接查看指定班级的留言板：\n', links = [];
        for (var i=0; i<info.session.teacher.wxclasses.length; i++) {
            var wxclass = info.session.teacher.wxclasses[i];
            links.push(ejs.render(
                '<a href="<%- url%>">' + wxclass.name + '</a>&nbsp&nbsp', 
                {
                    url: conf.site_root + '/front/message?classId=' + wxclass.id
                }
            ));
            if (i % 2 == 0) {
                links.push("\n\n");
            }
        }
        text += links.join("");
        next(null, text);
    }

    if (info.session.parent) {
        user = info.session.parent;
        sendLink();
    } else if (info.session.teacher) {
        if (info.session.teacher.isAdmin === 0) {
            user = info.session.teacher;
            sendLink();
        } else if (info.session.teacher.isAdmin === 1) {
            return sendLinks();
        }
    }
}

module.exports = function(webot) {
    // 消息提示语
    webot.set('user message start by text', {
        domain: "gateway",
        pattern: /^(消息|(leave )?message)/i,
        handler: add_message_start
    });
    webot.set('user message start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'MESSAGE_ADD';
        },
        handler: add_message_start
    });

    // 查看消息
    webot.set('user message view start by text', {
        domain: "gateway",
        pattern: /^(查看消息|(view )?message|我的消息)/i,
        handler: view_message
    });
    webot.set('user message view start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'MESSAGE_VIEW';
        },
        handler: view_message
    });
}