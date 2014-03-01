var Q = require("q");
var BaseServices = require("./BaseServices");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 查询消息数目
 */

/*
 * 插入消息 默认为老师提交,如果message含有studentId,则是家长提交
 */
module.exports.create = function(classId, message) {
    var url,
        data = {
            'title': message.title || '',
            'content': message.content || '',
            'top:': message.top || '0',
            'createdBy': message.createdBy,
            'sendsms': message.sms || '0'
        };

    if (message.studentId) {
        url = conf.site_root + '/api/class/' + classId + '/student/' + message.studentId + '/message';
    } else if (message.teacherId) {
        url = conf.site_root + '/api/class/' + classId + '/teacher/' + message.teacherId + '/message';
    }

    return BaseServices.create(url, data);
}
