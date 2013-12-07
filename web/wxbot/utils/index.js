var Q = require("q");
var fs = require('fs');
var request = require('request');
var conf = require("../../conf");
var SchoolServices = require("../../services/SchoolServices");
var UserServices = require("../../services/UserServices");

function ensure_school_is_bind (info, next) {
    if (info.session.failedCount === 5) {
        delete info.session.failedCount;
        info.ended = true;
        return next("抱歉，您的错误操作太多，请仔细阅读帮助文字。");
    }

    if (info.session.school) {
        return next();
    }

    if (info.is("text") && info.text.indexOf("SCHOOLBIND") >= 0) {
        return next();
    }

    SchoolServices.queryByOpenId(info.sp).then(function(school) {
        info.session.school = school;
        return next();
    }, function() {
        info.ended = true;
        return next("抱歉，该幼儿园的微信服务尚未激活。");
    });
}

function mobile_input_prompt(info, next) {
    info.ended = true;
    next("抱歉，本功能仅供本园家长及教师使用。\n如需认证，请点击左下角键盘图标后，直接回复您的【手机号】，例如13812345678");
}
function ensure_user_is_register (info, next) {
    if (info.session.parent || info.session.teacher) { return next(); }

    UserServices.queryByOpenId({schoolOpenId: info.sp, userOpenId: info.uid}).then(function(user) {
        switch(user.type + '') {
        case '0':
            info.session.parent = user;
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

function operation_is_failed(info, next) {
    if (info.session.failedCount) {
        info.session.failedCount += 1;
    } else {
        info.session.failedCount = 1;
    }
}

function createFolder(path) {
    var paths = path.split("/"), folder = conf.upload_root;
    for (var i=0; i<paths.length-1; i++) {
        folder += '/' + paths[i];
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, 0777);
            fs.chmodSync(folder, 0777);
        }
    }
}
function download_image(picUrl, localFile, callback) {
    createFolder(localFile);
    request.head(picUrl, function(err, res, body){
        var r = request(picUrl).pipe(fs.createWriteStream(conf.upload_root + '/' + localFile));
        r.on('finish', function () {
            if (callback) { callback(); }
        });
    });
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

module.exports.operation_is_failed = operation_is_failed;

module.exports.download_image = download_image;


