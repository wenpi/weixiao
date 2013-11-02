var i18n = require("i18n");
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: i18n.__('WeiXiao') });
};