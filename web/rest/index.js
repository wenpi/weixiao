/*
 * route to the wap
 */
var place = require('./place');

module.exports = function(app) {
	// the web rest api for the place
	app.get('/api/place', place.list());
	app.post("/api/place", place.create());
	app.get("/api/place/:_id", place.get());
	app.put("/api/place/:_id", place.update());
	app.delete("/api/place/:_id", place.remove());
}