/**
 * Usage:
 * - 消息功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var MessageServices = require("../../services/MessageServices");
var UserServices = require("../../services/UserServices");

function add_parent_start(info, next) {
    if (info.session.parent) {
        //info.wait("parent message input");
        UserServices.queryParentsAsParent({schoolOpenId: info.sp, userId: info.session.parent.id})
        .then(function(parents) {
            var contacts = [], prompt;
            for (var i=0; i<parents.length; i++) {
                contacts.push(parents[i].name + ' ' + parents[i].mobile);
            }
            if (parents.length >= 2) {
                prompt = '抱歉！已达上限，无法再添加认证家长。';
            } else {
                prompt = '请点击右下角键盘后输入其他家长的手机号：';
                info.wait("add parent mobile input");
            }
            var text = [
                "现有认证家长 " + parents.length + " 名:\n",
                contacts.join("\n") + '\n',
                prompt
            ];
            return next(null, text.join("\n"));
        }, function(err) {
            return next(null, "抱歉，获取您孩子的家长列表异常！无法添加家长，请联系老师。");
        });
    } else if (info.session.teacher) {
        next(null, '抱歉！该功能尚未为教师开放。');
    } else {
        return next(null, "抱歉，您不是认证用户，不能添加家长。");
    }
};

module.exports = function(webot) {
    // 消息提示语
    webot.set('add parent start by text', {
        domain: "gateway",
        pattern: /^(添加家长|(add )?parent)/i,
        handler: add_parent_start
    });
    webot.set('add parent start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'PARENT_ADD';
        },
        handler: add_parent_start
    });
}