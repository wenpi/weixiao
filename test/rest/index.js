var base = require("./base");
module.exports = function() {
	console.info(base.getBasicToken('basic-valid'));
	
	require("./testSchool")();
	require("./testClass")();
	require("./testTeacher")();
	require("./testClassTeacher")();
	require("./testClassParent")();
	require("./testTeacherMessage")();
	require("./testParentMessage")();
	require("./testTeacherPhoto")();
	require("./testParentPhoto")();
}