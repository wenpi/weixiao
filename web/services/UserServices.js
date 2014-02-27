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
    console.info(url);
    return BaseServices.queryPagingList(url);
};
exports.query = query;

/*
 * 返回含有mobile的数据
 */
exports.queryByMobile = function(mobile) {
    var deferred = Q.defer();

    query({mobile: mobile}).then(function(users) {
        if (users && users.length === 1) {
            deferred.resolve(users[0]);
        } else {
            deferred.reject({status: 500, message: "没有这个认证用户。"});
        }
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

/*
 * 返回含有openId的数据
 */
exports.queryByOpenId = function(opts) {
    var deferred = Q.defer();

    query({schoolId: opts.schoolId, openId: opts.openId})
    .then(function(users) {
        if (users && users.length === 1) {
            deferred.resolve(users[0]);
        } else {
            deferred.reject({status: 500, message: "该微信账号未认证。"});
        }
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

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
exports.updateProfileImage = function(user) {
    var url = conf.site_root + '/user/mobileModifyPhoto';
    return BaseServices.update(url, {
        'userid': user.id,
        'profileImage': user.profileImage 
    });
};