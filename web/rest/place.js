var PlaceServices = require("../services/PlaceServices");
/*
 * GET list the object
 */
exports.list = function(){
	return function(req, res) {
        PlaceServices.query().then(function(docs) {
            res.json(200, docs);
        }, function(err) {
            res.json(500, err);
        });
    };
};

/*
 * POST create a object
 */
exports.create = function() {
	return function(req, res) {
        PlaceServices.create(req.body).then(function(doc) {
            res.json(201, doc);
        }, function(err) {
            res.json(500, err);
        });
    };
};

/*
 * GET get a object
 */
exports.get = function() {
    return function(req, res) {
        if(!req.params._id) {
            res.json(400, {error: "ID is required."})
        }
        PlaceServices.get(req.params._id).then(function(doc) {
            res.json(200, doc);
        }, function(err) {
            res.json(err.status, err);
        });
    };
};

/*
 * PUT update a object
 */
exports.update = function() {
    return function(req, res) {
        if(!req.params._id) {
            res.json(400, {error: "ID is required."})
        }
        PlaceServices.get(req.params._id).then(function(doc) {
            req.body._id = req.params._id;
            PlaceServices.update(req.body).then(function(doc) {
                res.json(200, {});
            }, function(err) {
                res.json(500, err);
            });
        }, function(err) {
            res.json(404, {});
        });
        
    };
};

/*
 * DELETE remove a object
 */
exports.remove = function() {
    return function(req, res) {
        if(!req.params._id) {
            res.json(400, {error: "ID is required."})
        }

        PlaceServices.remove({
            _id: req.params._id
        }).then(function(doc) {
            res.json(200, {});
        }, function(err) {
            res.json(500, err);
        });
    };
};
