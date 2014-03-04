var Q = require("q");
var wechat = require('wechat');
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

    var url = conf.site_root + '/api/school' + extra;

    return BaseServices.queryPagingList(url);
};
exports.query = query;

/*
 * 更新数据 主要用于激活学校
 */
function bind(schoolId, data) {
    var url = conf.site_root + '/api/school/' + schoolId;

    return BaseServices.update(url, {openId: data.openId});
};
exports.bind = bind;

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
        if (schools.length === 0) {
            throw new Error("该标识幼儿园不存在。");
        }
        if (schools.length > 1) {
            throw new Error("幼儿园标识不唯一。");
        }
        var school = schools[0];
        if (school && school.openId) {
            throw new Error("该幼儿园已经绑定微信账号。");
        } else {
            gbSchool = school;
            return bind(schoolId, {
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