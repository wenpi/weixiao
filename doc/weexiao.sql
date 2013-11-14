/*
SQLyog Trial v11.27 (64 bit)
MySQL - 5.5.33 : Database - kindergarten
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*Table structure for table `wex_article` */

DROP TABLE IF EXISTS `wex_article`;

CREATE TABLE `wex_article` (
  `id` char(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `content` varchar(0) DEFAULT NULL COMMENT '内容',
  `school_id` char(36) DEFAULT NULL COMMENT '所属学校',
  `class_id` char(36) DEFAULT NULL COMMENT '所属班级',
  `tags` varchar(255) DEFAULT NULL COMMENT '标签',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(36) NOT NULL,
  `updated_time` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `archived` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_article` */

/*Table structure for table `wex_class` */

DROP TABLE IF EXISTS `wex_class`;

CREATE TABLE `wex_class` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT '名称',
  `school_id` char(36) DEFAULT NULL COMMENT '所属学校',
  `code` varchar(15) DEFAULT NULL COMMENT '班级编号:YYYYMMDD + 2位编号',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NULL DEFAULT NULL,
  `archived` tinyint(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_class` */

/*Table structure for table `wex_class_teacher` */

DROP TABLE IF EXISTS `wex_class_teacher`;

CREATE TABLE `wex_class_teacher` (
  `id` char(36) NOT NULL,
  `class_id` char(36) NOT NULL COMMENT '班级ID',
  `teacher_id` char(36) NOT NULL COMMENT '老师ID',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_time` timestamp NULL DEFAULT NULL,
  `archived` tinyint(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_class_teacher` */

/*Table structure for table `wex_message` */

DROP TABLE IF EXISTS `wex_message`;

CREATE TABLE `wex_message` (
  `id` char(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `content` varchar(0) NOT NULL COMMENT '内容',
  `type` int(11) NOT NULL COMMENT '类型0 提问 1 通知',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_time` timestamp NULL DEFAULT NULL,
  `archived` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_message` */

/*Table structure for table `wex_message_read` */

DROP TABLE IF EXISTS `wex_message_read`;

CREATE TABLE `wex_message_read` (
  `id` char(36) NOT NULL,
  `message_id` char(36) NOT NULL COMMENT '消息ID',
  `reply_id` char(36) DEFAULT NULL,
  `from_parent` char(36) DEFAULT NULL COMMENT '来自家长',
  `to_class` char(36) DEFAULT NULL COMMENT '发往班级',
  `from_class` char(36) DEFAULT NULL COMMENT '来自班级',
  `to_parent` char(36) DEFAULT NULL COMMENT '发往家长',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态0 未读 1 已读',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(36) NOT NULL,
  `updated_time` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `archived` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_message_read` */

/*Table structure for table `wex_message_reply` */

DROP TABLE IF EXISTS `wex_message_reply`;

CREATE TABLE `wex_message_reply` (
  `id` char(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `content` varchar(0) DEFAULT NULL COMMENT '内容',
  `message_id` char(36) NOT NULL COMMENT '回复消息',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `archived` tinyint(4) NOT NULL DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_message_reply` */

/*Table structure for table `wex_parent` */

DROP TABLE IF EXISTS `wex_parent`;

CREATE TABLE `wex_parent` (
  `id` char(36) NOT NULL,
  `mobile` varchar(20) NOT NULL COMMENT '手机',
  `password` char(32) NOT NULL COMMENT '登录密码',
  `name` varchar(20) NOT NULL COMMENT '姓名',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_time` timestamp NULL DEFAULT NULL,
  `archived` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_parent` */

/*Table structure for table `wex_parent_student` */

DROP TABLE IF EXISTS `wex_parent_student`;

CREATE TABLE `wex_parent_student` (
  `id` char(36) NOT NULL,
  `parent_id` char(36) NOT NULL COMMENT '家长id',
  `student_id` char(36) NOT NULL COMMENT '孩子ID',
  `school_open_id` varchar(50) DEFAULT NULL COMMENT '学校OpenId',
  `parent_open_id` varchar(50) DEFAULT NULL COMMENT '家长OpenId',
  `relative` varchar(20) NOT NULL COMMENT '父/母',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL,
  `archived` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_parent_student` */

/*Table structure for table `wex_school` */

DROP TABLE IF EXISTS `wex_school`;

CREATE TABLE `wex_school` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT '名称',
  `enabled` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '是否激活:1 激活 0 非激活',
  `open_id` varchar(50) DEFAULT NULL COMMENT '微信ID',
  `type` int(11) NOT NULL DEFAULT '0' COMMENT '类型:0 幼儿园',
  `group` varchar(50) DEFAULT NULL COMMENT '所属集团',
  `address` varchar(200) DEFAULT NULL COMMENT '地址',
  `phone` varchar(50) DEFAULT NULL COMMENT '联系电话',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `archived` tinyint(11) NOT NULL DEFAULT '1' COMMENT '是否存档:1 激活 0 非激活',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_school` */

/*Table structure for table `wex_source` */

DROP TABLE IF EXISTS `wex_source`;

CREATE TABLE `wex_source` (
  `id` char(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `type` int(11) NOT NULL COMMENT '类型图片0/音频1/视频2/',
  `local_path` varchar(255) DEFAULT NULL COMMENT '存放地址',
  `weixin_url` varchar(255) DEFAULT NULL COMMENT '微信地址',
  `school_id` char(36) DEFAULT NULL COMMENT '所属学校',
  `class_id` char(36) DEFAULT NULL COMMENT '所属班级',
  `tags` varchar(255) DEFAULT NULL COMMENT '标签',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(36) NOT NULL,
  `updated_time` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `archived` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_source` */

/*Table structure for table `wex_student` */

DROP TABLE IF EXISTS `wex_student`;

CREATE TABLE `wex_student` (
  `id` char(36) NOT NULL,
  `name` varchar(20) NOT NULL COMMENT '姓名',
  `gender` tinyint(4) NOT NULL COMMENT '性别1 男 0 女',
  `identity` varchar(50) DEFAULT NULL COMMENT '身份证',
  `birthday` char(8) DEFAULT NULL COMMENT '出生日期YYYYMMDD',
  `school_id` char(36) DEFAULT NULL COMMENT '当前所属学校',
  `class_id` char(36) DEFAULT NULL COMMENT '当前所属班级',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_time` timestamp NULL DEFAULT NULL,
  `archived` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_student` */

/*Table structure for table `wex_student_class` */

DROP TABLE IF EXISTS `wex_student_class`;

CREATE TABLE `wex_student_class` (
  `id` char(36) NOT NULL,
  `class_id` char(36) NOT NULL COMMENT '历史所在班级',
  `student_id` char(36) NOT NULL COMMENT '学生ID',
  `updated_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`class_id`,`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_student_class` */

/*Table structure for table `wex_teacher` */

DROP TABLE IF EXISTS `wex_teacher`;

CREATE TABLE `wex_teacher` (
  `id` char(36) NOT NULL,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` char(32) NOT NULL COMMENT '密码',
  `name` varchar(20) NOT NULL COMMENT '姓名',
  `school_id` char(36) DEFAULT NULL COMMENT '所属学校',
  `mobile` varchar(20) DEFAULT NULL COMMENT '手机号码',
  `is_admin` int(11) NOT NULL DEFAULT '0' COMMENT '0 否 1 是',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_time` timestamp NULL DEFAULT NULL,
  `archived` tinyint(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wex_teacher` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
