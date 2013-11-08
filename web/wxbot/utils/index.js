var Q = require("q");
var PlaceServices = require("../../services/PlaceServices");
var ParentServices = require("../../services/ParentServices");

function ensure_place_is_bind = function(info, next) {
    if (info.session.place) { next(); }

    PlaceServices.getByWeixinId(info.sp).then(function(place) {
        info.session.place = place;
        next();
    }, function() {
        info.ended = true;
        next("抱歉，该幼儿园的微信服务尚未激活。");
    });
}

function ensure_parent_is_register = function (info, next) {
    if (info.session.parent) { next(); }

    ParentServices.getByWeixinId(info.uid).then(function(parent) {
        info.session.parent = parent;
        next();
    }, function() {
        info.ended = true;
        next("抱歉，您还不是该幼儿园的认证家长。");
    });
}

module.exports.ensure_place_is_bind = ensure_place_is_bind;

module.exports.ensure_parent_is_register = function (info, next) {
    if (info.session.place && info.session.parent) { next(); }

    if (!info.session.place) {
	    ensure_place_is_bind(info, next);
    } else {
    	ensure_parent_is_register(info, next);
    }

}


