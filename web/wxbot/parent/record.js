/**
 * Usage:
 * - 发布成长记录功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");
var wxconst = require("../const");
var UserServices = require("../../services/UserServices");
var RecordServices = require("../../services/RecordServices");

module.exports = function(webot) {
	// 等待主题输入
	webot.waitRule('parent kid record select type', function(info, next) {
        if (info.is("event")) {
            return next();
        }

		if (!info.is("text")) {
			info.rewait("parent kid record image text");
			return next(null, "抱歉，只能输入文字。");
		}
		var text = info.text + '';
        if (text !== '1' && text !== '2') {
            info.rewait("parent kid record select type");
            return next(null, "抱歉，只能输入数字1或者2。");
        }
        var user = info.session.parent;
    	var students = info.session.parent.students;
        if (students.length === 0) {
            return next(null, "抱歉，该家长的孩子信息尚未录入。");
        }
        switch(text) {
        case "1":
            info.wait("parent kid record input text");
            return next(null, "通过这里输入的文字记录将直接显示在记录时间轴上，仅有您和本班老师可见。\n\n请输入文字：");
        break;
        case "2":
            info.wait("parent kid record image text");
            return next(null, "通过这里上传的图片记录将直接显示在记录时间轴上，仅您和本班老师可见。\n\n上传照片前，请先输入主题文字，简单描述一下您要发布的照片内容。例如“和孩子一起读书” “集体户外游戏小青蛙跳荷叶”等。\n\n请输入主题：");
        default:
            info.rewait("parent kid record select type");
            return next(null, "抱歉，只能输入数字1或者2。");
        }
	});

    // 等待文字记录输入
    webot.waitRule('parent kid record input text', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.records;
            return next();
        }
        if (!info.is("text")) {
            info.rewait("parent kid record input text");
            return next(null, "抱歉，只能输入文字。");
        }
        // 接受提交指令
        if (info.text === wxconst.YES) {
            if (info.session.parent.students && info.session.parent.students.length === 0) {
                return next(null, "抱歉，获取孩子信息异常，无法提交成长记录。");
            }
            if (!info.session.parent.records || info.session.parent.records.length == 0) {
                info.rewait("parent kid record input text");
                return next(null, "您还没输入文字，请输入文字：");
            }
            // 记录入库
            RecordServices.create(info.session.parent, {
                studentId: info.session.parent.students[0].id,
                contenttype: '0',
                content: info.session.parent.records.join(" ")
            }).then(function() {
                delete info.session.parent.records;
                var response = ejs.render(
                    '发布成功！\n<a href="<%- url%>">请点击这里查看成长记录</a>', 
                    {
                        url: conf.site_root + '/studentPath/mobileView?student_id=' + info.session.parent.students[0].id
                    }
                );
                return next(null, response);
            }, function() {
                delete info.session.parent.records;
                next(null, "抱歉，服务器异常，无法发布成长记录。");
            });
            return;
        }
        // 接受取消指令
        if (info.text === wxconst.NO) {
            delete info.session.parent.records;
            return next(null, "操作已取消，如需再次发布请再次点击【发布成长记录】。");
        }
        // 构造message
        if (!info.session.parent.records) {
            info.session.parent.records = [];
        }
        info.session.parent.records.push(info.text);
        info.wait("parent kid record input text");
        return next(null, "已存成草稿，您可继续输入文字。\n\n回复【" + wxconst.YES + "】提交文字记录\n回复【" + wxconst.NO + "】取消");
    });

	// 等待图片记录的主题输入
	webot.waitRule('parent kid record image text', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.imageRecord;
            return next();
        }
		if (!info.is("text")) {
			utils.operation_is_failed(info, next);
			info.rewait("parent kid record image text");
			return next(null, "抱歉，只能输入文字。");
		}
		// 构造image
		info.session.parent.imageRecord = {title: '', photos: []};
		info.session.parent.imageRecord.title = info.text;
		info.wait("parent kid record image upload");
		return next(null, "主题【" + info.text + "】创建成功，请选择您要上传的图片：");
	});

	// 等待图片记录
	webot.waitRule('parent kid record image upload', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.imageRecord;
            return next();
        }
		// 接受提交指令
		if (info.is("text") && info.text === wxconst.YES) {
			if (info.session.parent.imageRecord.photos.length == 0) {
				utils.operation_is_failed(info, next);
				info.rewait("parent kid record image upload");
				return next(null, "您还没上传图片，请上传：");
			}
            // 图片入库
            var time = (new Date()).getTime();
            for (var i=0; i<info.session.parent.imageRecord.photos.length; i++) {
                var filename = 'school/' +  info.session.school.id + '/path/' + info.session.parent.mobile + '/' + time + '/' + i;
                utils.download_image(info.session.parent.imageRecord.photos[i], filename);
                info.session.parent.imageRecord.photos[i] = filename;
            }
            // 记录入库
            RecordServices.create(info.session.parent, {
                studentId: info.session.parent.students[0].id,
                contenttype: '1',
                content: info.session.parent.imageRecord.title,
                photos: info.session.parent.imageRecord.photos
            }).then(function() {
                delete info.session.parent.records;
                var response = ejs.render(
                    '发布成功！\n<a href="<%- url%>">请点击这里查看成长记录</a>', 
                    {
                        url: conf.site_root + '/studentPath/mobileView?student_id=' + info.session.parent.students[0].id
                    }
                );
                return next(null, response);
            }, function() {
                delete info.session.parent.records;
                next(null, "抱歉，服务器异常，无法发布成长记录。");
            });
            return;
		}
		// 接受取消指令
		if (info.is("text") && info.text === wxconst.NO) {
			delete info.session.parent.imageRecord;
			return next(null, "操作已取消，如需发布请再次点击【添加成长记录】。");
		}

		if (!info.is("image")) {
			utils.operation_is_failed(info, next);
			info.rewait("parent kid record image upload");
			return next(null, "抱歉，只能上传图片。");
		} else {
			// 构造image
			if (info.session.parent.imageRecord) {
				info.session.parent.imageRecord.photos.push(info.param.picUrl);
			}
			info.wait("parent kid record image upload");
			var len = info.session.parent.imageRecord.photos.length;
			return next(null, "已存草稿图片" + len + "张，您可继续上传图片。\n\n回复【" + wxconst.YES + "】发布图片记录\n回复【" + wxconst.NO + "】取消");
		}
	});
}