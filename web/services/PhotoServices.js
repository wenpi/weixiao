var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 插入图片
 */
module.exports.create = function(data) {
    var url = conf.site_root + '/api/class/' + data.classId;

    if (data.teacherId) {
        url += '/teacher/' + data.teacherId + 'photo';
    } else if (data.studentId) {
        url += '/student/' + data.studentId + 'photo';
    }

    return BaseServices.create(url, data);
}
