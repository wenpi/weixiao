var base = require("./base");
module.exports = function() {
	console.info(base.getToken({user: '3d6a1441-b4f5-445c-a27f-02a8667ad293'}));
	//return;

	require("./testTeacher")();
	return;
	require("./testSchool")();
	require("./testClass")();
	require("./testTeacher")();
	require("./testClassTeacher")();
	require("./testClassParent")();
	require("./testTeacherMessage")();
	require("./testParentMessage")();
	require("./testTeacherLeave")();
	require("./testTeacherPhoto")();
	require("./testParentPhoto")();
	require("./testTeacherGallery")(); 
	require("./testTeacherPath")();
}