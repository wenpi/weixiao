/*
 * GET register page.
 */
exports.register = function(req, res){
	var schoolId = req.params.schoolId;
	console.info(schoolId);
 	res.render('wap/user/register', {});
};