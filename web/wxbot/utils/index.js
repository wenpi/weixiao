require('date-utils');
var Q = require("q");
var fs = require('fs');
var request = require('request');
var conf = require("../../conf");
var SchoolServices = require("../../services/SchoolServices");
var UserServices = require("../../services/UserServices");
var TeacherServices = require("../../services/TeacherServices");
var ClassServices = require("../../services/ClassServices");
var StudentServices = require("../../services/StudentServices");

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

    SchoolServices.query({openId: info.sp})
    .then(function(schools) {
        if (schools.length == 0) {
            return next("抱歉，该幼儿园的微信服务尚未激活。");
        } else if (schools.length > 1) {
            return next("幼儿园的Open ID重复。");
        }

        info.session.school = schools[0];
        return next();
    }, function() {
        info.ended = true;
        return next("查询幼儿园数据异常。");
    });
}

function mobile_input_prompt(info, next) {
    info.ended = true;
    next("抱歉，本功能仅供本园家长及教师使用。\n如需认证，请点击左下角键盘图标后，直接回复您的【手机号】，例如13812345678");
}

function ensure_user_is_register (info, next) {
    if (info.session.parent || info.session.teacher) { return next(); }

    UserServices.query({
        schoolId: info.session.school.id,
        openId: info.uid
    }).then(function(users) {
        var user;

        if (users.length == 0) {
            info.ended = true;
            return mobile_input_prompt(info, next);
        } else if (users.length > 1) {
            info.ended = true;
            return next(null, "微信识别重复，请联系管理员。");
        } else {
            user = users[0];
        }

        switch(user.type + '') {
        case '0':
            info.session.parent = user;
            StudentServices.queryByParentId({
                schoolId: info.session.school.id,
                parentId: info.session.parent.id
            }).then(function(students) {
                info.session.parent.students = students;
                if (students.length != 1) {
                    info.ended = true;
                    return next(null, "孩子数不为1，暂时无法使用微信客户端。");
                }
                return next();
            }, function(err) {
                return next(null, err);
            });
        break;
        case '1':
            info.session.teacher = user;
            if (info.session.teacher.isAdmin !== undefined) {
                return next();
            } else {
                TeacherServices.queryByUserId({
                    schoolId: info.session.school.id,
                    userId: info.session.teacher.id
                }).then(function(teacher) {
                    info.session.teacher.teacherId = teacher.id;
                    info.session.teacher.isAdmin = parseInt(teacher.isAdmin, 10);

                    if (info.session.teacher.isAdmin === 1) {
                        ClassServices.queryBySchool({schoolId: info.session.school.id})
                        .then(function(wxclasses) {
                            info.session.teacher.wxclasses = wxclasses;
                            return next();
                        }, function(err) {
                            return next(null, err);
                        });
                    } else {
                        ClassServices.queryByTeacher({
                            schoolId: info.session.school.id,
                            teacherId: teacher.id
                        }).then(function(wxclasses) {
                            if (wxclasses.length != 1) {
                                info.ended = true;
                                return next(null, "抱歉，您只能管理一个班级。");
                            }
                            info.session.teacher.wxclasses = wxclasses;
                            return next();
                        }, function(err) {
                            info.ended = true;
                            return next(null, "抱歉，您还没有班级可以管理");
                        });
                    }
                }, function(err) {
                    return next(null, err);
                });
            }
        break;
        default:
            return mobile_input_prompt(info, next);
        break;
        }
    }, function(err) {
        info.ended = true;
        return next(null, "检查用户权限出错，请联系管理员。");
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
            fs.mkdirSync(folder, 0755);
            fs.chmodSync(folder, 0755);
            fs.chownSync(folder, 48, 48);
        }
    }
}
function download_image(picUrl, localFile, callback) {
    
    createFolder(localFile);
    
    var absLocalFile = conf.upload_root + localFile;
    request.head(picUrl, function(err, res, body){
        var r = request(picUrl).pipe(fs.createWriteStream(absLocalFile));
        r.on('finish', function () {
            fs.chmodSync(absLocalFile, 0755);
            fs.chownSync(absLocalFile, 48, 48)
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

module.exports.is_holiday = function(date) {
    var holidays = {
        '2014-01-01': true,
        '2014-01-26': false,
        '2014-01-31': true,
        '2014-02-01': true,
        '2014-02-02': true,
        '2014-02-03': true,
        '2014-02-04': true,
        '2014-02-05': true,
        '2014-02-06': true,
        '2014-02-08': false,
        '2014-04-05': true,
        '2014-04-06': true,
        '2014-04-07': true,
        '2014-05-01': true,
        '2014-05-02': true,
        '2014-05-03': true,
        '2014-05-04': false,
        '2014-05-31': true,
        '2014-06-01': true,
        '2014-06-02': true,
        '2014-09-06': true,
        '2014-09-07': true,
        '2014-09-08': true,
        '2014-09-28': false,
        '2014-10-01': true,
        '2014-10-02': true,
        '2014-10-03': true,
        '2014-10-04': true,
        '2014-10-05': true,
        '2014-10-06': true,
        '2014-10-07': true,
        '2014-10-11': false
    }
    if (holidays[date.toYMD()]) {
        return holidays[date.toYMD()];
    }
    if (date.getDay() === 0 || date.getDay() === 6) {
        return true;
    }
    return false;
}


