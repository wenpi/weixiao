var i18n = require("i18n");
/*
 * GET register page.
 */
exports.register = function(req, res){
  res.render('mobile/user/register', {i18n: i18n});
};