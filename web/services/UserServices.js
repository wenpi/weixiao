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
    var deferred = Q.defer(),
        url = conf.site_root + '/api/user' + extra;

    var options = {
        url: url,
        method: 'GET',
        headers: BaseServices.getAuthoriedHeader()
    };

    console.info(url);
    function callback(error, response, body) {
        console.info(body);
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            console.info(jsondata);
            if (jsondata.result) {
                deferred.resolve(jsondata.result);
            } else {
                deferred.resolve([]);
            }
        } else {
            deferred.reject();
        }
    }

    request(options, callback);

    return deferred.promise;
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
        console.info(users);
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
 * 更新profile image
 */
module.exports.updateProfileImage = function(user) {
    var deferred = Q.defer(),
        url = conf.site_root + '/user/mobileModifyPhoto';

    var data = {
        'userid': user.id,
        'profileImage': user.profileImage 
    };

    request.post(
        url,
        {
            form: data
        },
        function (error, response, body) {
            if (error) {
                //console.info(response.body)
                deferred.reject(error);
            }
            deferred.resolve();
        }
    );

    return deferred.promise;
};