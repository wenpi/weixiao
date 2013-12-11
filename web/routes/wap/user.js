/*
 * GET register page.
 */
exports.register = function(req, res){
	var schoolId = req.params.schoolId;
 	res.render('wap/user/register', {});
};