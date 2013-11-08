var Q = require("q");
var SchoolServices = require("../../services/SchoolServices");
var ParentServices = require("../../services/ParentServices");

function ensure_school_is_bind (info, next) {
    if (info.session.school) { next(); }

    SchoolServices.getByWeixinId(info.sp).then(function(school) {
        info.session.school = school;
        next();
    }, function() {
        info.ended = true;
        next("抱歉，该幼儿园的微信服务尚未激活。");
    });
}

function ensure_parent_is_register (info, next) {
    if (info.session.parent) { next(); }

    ParentServices.getByWeixinId(info.uid).then(function(parent) {
        info.session.parent = parent;
        next();
    }, function() {
        info.ended = true;
        next("抱歉，您还不是该幼儿园的认证家长。");
    });
}

module.exports.ensure_school_is_bind = ensure_school_is_bind;

module.exports.ensure_parent_is_register = function (info, next) {
    if (info.session.school && info.session.parent) { next(); }

    if (!info.session.school) {
	    ensure_school_is_bind(info, next);
    } else {
    	ensure_parent_is_register(info, next);
    }

}


