/*
 * list the students
 */
var conf = require("../../conf");
var StudentServices = require("../../services/StudentServices");
exports.entry = function(req, res){
	var schoolId = req.params.schoolId;
	var classId = req.params.classId;

	StudentServices.queryByClassId({
		schoolId: schoolId,
		classId: classId
	}).then(function(students) {
		students.sort(function(a, b) {
			return a.name[0] >= b.name[0] ? 1 : -1;
		});
		res.render('wap/record/entry', {
			link: conf.site_root + '/studentPath/mobileView',
			students: students
 		});
	}, function(err) {
		console.info(err);
		res.render('wap/record/entry', {
			link: conf.site_root + '/studentPath/mobileView',
			students: []
 		});
	});
 	
};