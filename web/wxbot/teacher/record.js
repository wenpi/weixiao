/**
 * Usage:
 * - 发布成长记录功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");
var UserServices = require("../../services/UserServices");
var RecordServices = require("../../services/RecordServices");

module.exports = function(webot) {
    function sendLink(info, next, student) {
        delete info.session.viewrecord;
        var text = ejs.render(
            '<a href="<%- url%>">请点击这里查看成长记录</a>', 
            {
                //name: '小明',
                url: conf.site_root + '/studentPath/mobileView?student_id=' + student.id
            }
        )
        next(null, text);
    }
    // 输入孩子关键字
    webot.waitRule('teacher kid record name prompt', function(info, next) {
        if (info.is("event")) {
            delete info.session.viewrecord;
            return next();
        }

        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("teacher kid record name prompt");
            return next(null, "抱歉，只能输入文字。");
        }

        delete info.session.students;
        info.session.students = [];
        UserServices.queryStudentsAsTeacher({
            userId: info.session.teacher.id
        }).then(function(results) {
            var students = [];
            for (var i=0; i<results.length; i++) {
                var student = results[i];
                if (student.name && student.name.indexOf(info.text) >= 0) {
                    students.push(student);
                }
            }
            if (students.length == 0) {
                info.rewait("teacher kid record name prompt");
                return next(null, "抱歉，查不到匹配的孩子。");
            }

            if (students.length == 1) {
                if (info.session.viewrecord === "teacher") {
                    return sendLink(info, next, students[0]);
                } else {
                    info.session.students = students;
                    info.wait("teacher kid record select type");
                    return next(null, "为孩子：" + students[0].name + "\n\n发布文字记录请回复【1】\n发布照片记录请回复【2】");
                }
            }
            if (students.length > 5) {
                info.rewait("teacher kid record name prompt");
                return next(null, "抱歉，查找匹配的孩子超过5位，请提供更详细信息。");
            }
            var prompt = "请回复孩子所对应的数字：\n";
            for (var i=0; i<students.length; i++) {
                var student = students[i];
                prompt += "【" + (i+1) + "】 " + student.name + "\n";
            }
            info.session.students = students;
            info.wait("teacher kid select");
            return next(null, prompt);
        });
    });
    // 输入孩子关键字
    webot.waitRule('teacher kid select', function(info, next) {
        if (info.is("event")) {
            delete info.session.viewrecord;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("teacher kid select");
            return next(null, "抱歉，只能输入文字。");
        }

        var idx = parseInt(info.text, 10);
        var students = info.session.students;

        if (isNaN(idx)) {
            utils.operation_is_failed(info, next);
            info.rewait("teacher kid select");
            return next(null, "抱歉，只能输入数字。");
        }

        if (idx > students.length) {
            utils.operation_is_failed(info, next);
            info.rewait("teacher kid select");
            return next(null, "抱歉，没有这个选项。");
        }

        var student = students[idx - 1];
        info.session.students = [];
        info.session.students.push(student);

        if (info.session.viewrecord === "teacher") {
            return sendLink(info, next, student);
        } else {
            info.wait("teacher kid record select type");
            return next(null, "为孩子：" + student.name + "\n\n发布文字记录请回复【1】\n发布照片记录请回复【2】");
        }
    });

	// 等待主题输入
	webot.waitRule('teacher kid record select type', function(info, next) {
        if (info.is("event")) {
            return next();
        }
		if (!info.is("text")) {
			utils.operation_is_failed(info, next);
			info.rewait("teacher kid record image text");
			return next(null, "抱歉，只能输入文字。");
		}
		var text = info.text + '';
        if (text !== '1' && text !== '2') {
        	utils.operation_is_failed(info, next);
            info.rewait("teacher kid record select type");
            return next(null, "抱歉，只能输入数字1或者2。");
        }
        switch(text) {
        case "1":
        	info.wait("teacher kid record input text");
        	return next(null, "通过这里输入的文字记录将直接显示在记录时间轴上，仅有教师和该名儿童家长可见。\n\n需在" + conf.timeout.desc + "内完成该项操作，请输入文字：");
        break;
        case "2":
        	info.wait("teacher kid record image text");
        	return next(null, "通过这里上传的图片记录将直接显示在记录时间轴上，仅有教师和该名儿童家长可见。\n\n上传照片前，请先输入主题文字，简单描述一下您要发布的照片内容。\n\n例如“和孩子一起读书” “集体户外游戏小青蛙跳荷叶”等，需在" + conf.timeout.desc + "内完成该项操作。\n\n请输入主题：");
        default:
        	utils.operation_is_failed(info, next);
        	info.rewait("teacher kid record select type");
        	return next(null, "抱歉，只能输入数字1或者2。");
        }
	});

    // 等待文字记录输入
    webot.waitRule('teacher kid record input text', function(info, next) {
        if (info.is("event")) {
        	delete info.session.teacher.records;
            return next();
        }
        if (!info.is("text")) {
            info.rewait("teacher kid record input text");
            return next(null, "抱歉，只能输入文字。");
        }
        if (info.session.teacher) {
            // 接受提交指令
            if (info.text === '好') {
                if (!info.session.teacher.records || info.session.teacher.records.length == 0) {
                	utils.operation_is_failed(info, next);
                    info.rewait("teacher kid record input text");
                    return next(null, "您还没输入文字，请输入文字：");
                }
                // 记录入库
                RecordServices.create(info.session.teacher, {
                    studentId: info.session.students[0].id,
                    contenttype: '0',
                    content: info.session.teacher.records.join(" ")
                }).then(function() {
                    var sid = info.session.students[0].id;
                    delete info.session.teacher.records;
                    var response = ejs.render(
                        '发布成功！\n<a href="<%- url%>">请点击这里查看成长记录</a>', 
                        {
                            url: conf.site_root + '/studentPath/mobileView?student_id=' + sid
                        }
                    );
                    return next(null, response);
                }, function() {
                    delete info.session.teacher.records;
                    next(null, "抱歉，后台异常，无法发布成长记录。");
                });
                return;
            }
            // 接受取消指令
            if (info.text === '不') {
                delete info.session.teacher.records;
                return next(null, "操作已取消，如需再次发布请再次点击【发布成长记录】。");
            }
            // 构造message
            if (!info.session.teacher.records) {
                info.session.teacher.records = [];
            }
            info.session.teacher.records.push(info.text);
            info.wait("teacher kid record input text");
            return next(null, "已存成草稿，您可继续输入文字。\n\n发送【好】提交文字记录\n发送【不】取消");
        }
    });

	// 等待图片记录的主题输入
	webot.waitRule('teacher kid record image text', function(info, next) {
        if (info.is("event")) {
        	delete info.session.teacher.imageRecord;
            return next();
        }
		if (!info.is("text")) {
			utils.operation_is_failed(info, next);
			info.rewait("teacher kid record image text");
			return next(null, "抱歉，只能输入文字。");
		}
		// 构造image
		info.session.teacher.imageRecord = {title: '', photos: []};
		info.session.teacher.imageRecord.title = info.text;
		info.wait("teacher kid record image upload");
		return next(null, "主题【" + info.text + "】创建成功，请选择您要上传的图片：");
	});

	// 等待图片记录
	webot.waitRule('teacher kid record image upload', function(info, next) {
        if (info.is("event")) {
        	delete info.session.teacher.imageRecord;
            return next();
        }
		// 接受提交指令
		if (info.is("text") && info.text === '好') {
			if (info.session.teacher.imageRecord.photos.length == 0) {
				info.rewait("teacher kid record image upload");
				return next(null, "您还没上传图片，请上传：");
			}
            // 图片入库
            for (var i=0; i<info.session.teacher.imageRecord.photos.length; i++) {
                var filename = info.session.teacher.mobile + '_record_' + (new Date()).getTime()+ '_' + i;
                utils.download_image(info.session.teacher.imageRecord.photos[i], filename);
                info.session.teacher.imageRecord.photos[i] = filename;
            }
            // 记录入库
            RecordServices.create(info.session.teacher, {
                studentId: info.session.students[0].id,
                contenttype: '1',
                content: info.session.teacher.imageRecord.title,
                photos: info.session.teacher.imageRecord.photos
            }).then(function() {
                var sid = info.session.students[0].id;
                delete info.session.students;
                delete info.session.teacher.imageRecord;
                var response = ejs.render(
                    '发布成功！\n<a href="<%- url%>">请点击这里查看成长记录</a>', 
                    {
                        url: conf.site_root + '/studentPath/mobileView?student_id=' + sid
                    }
                );
                return next(null, response);
            }, function() {
                delete info.session.students;
                delete info.session.teacher.imageRecord;
                next(null, "抱歉，后台异常，无法发布成长记录。");
            });
            return;
		}
		// 接受取消指令
		if (info.is("text") && info.text === '不') {
			delete info.session.teacher.imageRecord;
			return next(null, "操作已取消，如需发布请再次点击【添加成长记录】。");
		}

		if (!info.is("image")) {
			utils.operation_is_failed(info, next);
			info.rewait("teacher kid record image upload");
			return next(null, "抱歉，只能上传图片。");
		} else {
			// 构造image
			if (info.session.teacher.imageRecord) {
				info.session.teacher.imageRecord.photos.push(info.param.picUrl);
			}
			info.wait("teacher kid record image upload");
			var len = info.session.teacher.imageRecord.photos.length;
			return next(null, "已存草稿图片" + len + "张，您可继续上传图片。\n\n发送【好】发布图片记录\n发送【不】取消");
		}
	});
}