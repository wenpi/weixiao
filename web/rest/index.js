/*
 * route to the wap
 */
var school = require('./school');

module.exports = function(app) {
	// the web rest api for the school
	app.get('/api/school', school.list());
	app.post("/api/school", school.create());
	app.get("/api/school/:_id", school.get());
	app.put("/api/school/:_id", school.update());
	app.delete("/api/school/:_id", school.remove());
}