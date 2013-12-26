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
		res.render('wap/record/entry', {
			link: conf.site_root + '/studentPath/mobileView',
			students: students
 		});
	}, function() {
		res.render('wap/record/entry', {
			link: conf.site_root + '/studentPath/mobileView',
			students: []
 		});
	});
 	
};