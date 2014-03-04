var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 查询菜单数据
 */
function query(conditions){
    var extra = '?_t=1';
    for (var prop in conditions) {
        extra += '&' + prop + '=' + conditions[prop];
    }
    var url = conf.site_root + '/api/user' + extra;
    return BaseServices.queryPagingList(url);
};
exports.query = query;

/*
 * 查询某个用户的未读实体情况
 */
exports.queryUnread = function(data) {
    var url = conf.site_root + '/api/user/' + data.userId + '/unread';
    return BaseServices.queryAll(url);
}

/*
 * 更新profile image
 */
exports.update = function(shoolId, userId, parms) {
    var url = conf.site_root + '/api/school/' + shoolId + '/user/' + userId;
    return BaseServices.update(url, parms);
};