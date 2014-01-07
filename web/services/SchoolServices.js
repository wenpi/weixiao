var Q = require("q");
var wechat = require('wechat');
var request = require('request');
var conf = require("../conf");
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
        url = conf.site_root + '/api/school' + extra;

    var options = {
        url: url,
        method: 'GET',
        headers: BaseServices.getAuthoriedHeader()
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
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
 * 返回绑定的场所
 */
exports.queryByOpenId = function(openId) {
    var deferred = Q.defer();

    query({openId: openId}).then(function(schools) {
        if (schools.length == 1) {
            deferred.resolve(schools[0]);
        } else {
            deferred.reject({status: 500, message: "该微信账号未绑定幼儿园。"});
        }
    })

    return deferred.promise;
};

/*
 * 更新数据 主要用于激活学校
 */
function update(schoolId, data) {
    var deferred = Q.defer(),
        url = conf.site_root + '/api/school/' + schoolId;

    var options = {
        url: url,
        method: 'PUT',
        headers: BaseServices.getAuthoriedHeader(),
        form: {
            openId: data.openId
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve();
        } else {
            deferred.reject();
        }
    }

    request(options, callback);

    return deferred.promise;
};
exports.update = update;

/**
 * 和微信账号绑定
 */
exports.bind = function(schoolId, openId) {
    var deferred = Q.defer(), gbSchool;

    if(!schoolId) {
        deferred.reject({status: 400, message: "激活标识未提供。"});
    }

    if(!openId) {
        deferred.reject({status: 400, message: "微信ID未提供。"});
    }

    query({openId: openId}).then(function(schools) {
        if (schools.length > 0) {
            throw new Error("该微信账号已经绑定幼儿园。");
        } else {
            return query({id: schoolId});
        }
    })
    .then(function(schools) {
        if (schools.length !== 0) {
            throw new Error("幼儿园标识不唯一。");
        }
        var school = schools[0];
        if (school && school.openId) {
            throw new Error("该幼儿园已经绑定微信账号。");
        } else {
            gbSchool = school;
            return update(schoolId, {
                openId: openId
            });
        }
    }).then(function() {
        gbSchool.openId = openId;
        gbSchool.enabled = 1;
        deferred.resolve(gbSchool);
    }).fail(function(err) {
        deferred.reject({status: 500, message: err.message});
    });

    return deferred.promise;
}