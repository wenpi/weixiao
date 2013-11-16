var Q = require("q");
var SchoolServices = require("../../services/SchoolServices");
var ParentServices = require("../../services/ParentServices");
var UserServices = require("../../services/UserServices");

function ensure_school_is_bind (info, next) {
    if (info.session.school) {
        return next();
    }
    if (info.is("text") && info.text.indexOf("SCHOOLBIND") >= 0) {
        return next();
    }

    SchoolServices.getByOpenId(info.sp).then(function(school) {
        info.session.school = school;
        next();
    }, function() {
        info.ended = true;
        next("抱歉，该幼儿园的微信服务尚未激活。");
    });
}

function mobile_input_prompt(info, next) {
    info.wait("user mobile input");
    next("抱歉，您还不是该幼儿园的认证用户。如需认证，请输入文字【认证】及您【手机号】，如：认证13812345678");
}
function ensure_user_is_register (info, next) {
    if (info.session.parent || info.session.teacher) { return next(); }

    UserServices.getByOpenId({schoolOpenId: info.sp, userOpenId: info.uid}).then(function(user) {
        switch(parent.type + '') {
        case '0':
            info.session.parent = parent;
            return next();
        break;
        case '1':
            info.session.teacher = user;
            return next();
        break;
        default:
            return mobile_input_prompt(info, next);
        break;
        }
    }, function() {
        return mobile_input_prompt(info, next);
    });
}

function ensure_parent_is_register (info, next) {
    if (info.session.parent) {
        return next();
    } else {
        info.ended = true;
        return next("抱歉，您还不是该幼儿园的认证家长。");
    }
}

function ensure_teacher_is_register (info, next) {
    if (info.session.teacher) {
        return next();
    } else {
        info.ended = true;
        return next("抱歉，您还不是该幼儿园的认证老师。");
    }
}

// Export校验功能函数
module.exports.ensure_school_is_bind = ensure_school_is_bind;

module.exports.ensure_user_is_register = ensure_user_is_register;

module.exports.ensure_parent_is_register = function (info, next) {
    if (info.session.school && info.session.parent) { return next(); }

    if (!info.session.school) {
	    ensure_school_is_bind(info, next);
    } else {
    	ensure_parent_is_register(info, next);
    }
}

module.exports.ensure_teacher_is_register = function (info, next) {
    if (info.session.school && info.session.teacher) { return next(); }

    if (!info.session.school) {
        ensure_school_is_bind(info, next);
    } else {
        ensure_teacher_is_register(info, next);
    }
}


