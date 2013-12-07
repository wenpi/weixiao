/**
 * Usage:
 * - 图片功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");
var wxconst = require("../const");
var ImageServices = require("../../services/ImageServices");

module.exports = function(webot) {
	// 等待主题输入
	webot.waitRule('teacher image input text', function(info, next) {
        if (info.is("event")) {
            return next();
        }
		if (!info.is("text")) {
			utils.operation_is_failed(info, next);
			info.rewait("teacher image input text");
			return next(null, "抱歉，只能输入文字。");
		}
		// 构造image
		info.session.teacher.publishImage = {title: '', photos: []};
		info.session.teacher.publishImage.title = info.text;
		info.wait("teacher image input image");
		return next(null, "主题【" + info.text + "】创建成功，请直接选择上传您要分享的图片：");
	});

	webot.waitRule('teacher image input image', function(info, next) {
        if (info.is("event")) {
        	delete info.session.teacher.publishImage;
            return next();
        }
		// 接受提交指令
		if (info.is("text") && info.text === wxconst.YES) {
			if (info.session.teacher.publishImage.photos.length == 0) {
				utils.operation_is_failed(info, next);
				info.rewait("teacher image input image");
				return next(null, "您还没上传图片，请上传：");
			}
			// 上传图片
			var time = (new Date()).getTime();
            for (var i=0; i<info.session.teacher.publishImage.photos.length; i++) {
                var filename = 'school/' +  info.session.school.id + '/photo/' + info.session.teacher.mobile + '/' + time + '/' + i;
    			utils.download_image(info.session.teacher.publishImage.photos[i], filename);
    			info.session.teacher.publishImage.photos[i] = filename;
            }
            ImageServices.create(info.session.teacher, info.session.teacher.publishImage).then(function() {
            	delete info.session.teacher.publishImage;
                var text = ejs.render(
                    '图片已发布！\n<a href="<%- url%>">请点击这里查看</a>或者点击菜单【班级相册】', 
                    {
                        url: conf.site_root + '/classPhoto/mobileview' //?shoolId' + info.session.school.id +' &teacherId=' + info.session.teacher.id
                    }
                );
                return next(null, text);
            }, function() {
            	delete info.session.teacher.publishImage;
                next(null, "抱歉，后台异常，无法发布图片。");
            });
            return;
		}
		// 接受取消指令
		if (info.is("text") && info.text === wxconst.NO) {
			delete info.session.teacher.publishImage;
			return next(null, "发布操作已取消，如需发布请再次点击【发布照片】。");
		}

		if (!info.is("image")) {
			utils.operation_is_failed(info, next);
			info.rewait("teacher image input image");
			return next(null, "抱歉，只能上传图片。");
		} else {
			// 构造image
			if (info.session.teacher.publishImage) {
				info.session.teacher.publishImage.photos.push(info.param.picUrl);
			}
			info.wait("teacher image input image");
			var len = info.session.teacher.publishImage.photos.length;
			return next(null, "已存草稿图片" + len + "张，您可继续上传图片。\n发送【" + wxconst.YES + "】发布图片\n发送【" + wxconst.NO + "】取消");
		}
	});
}