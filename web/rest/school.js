var SchoolServices = require("../services/SchoolServices");
/*
 * GET list the object
 */
exports.list = function(){
	return function(req, res) {
        SchoolServices.query().then(function(docs) {
            res.json(200, docs);
        }, function(err) {
            res.json(err.status || 500, err);
        });
    };
};

/*
 * POST create a object
 */
exports.create = function() {
	return function(req, res) {
        SchoolServices.create(req.body).then(function(doc) {
            res.json(201, doc);
        }, function(err) {
            res.json(err.status || 500, err);
        });
    };
};

/*
 * GET get a object
 */
exports.get = function() {
    return function(req, res) {
        if(!req.params._id) {
            res.json(400, {message: "ID is required."})
        }
        SchoolServices.get(req.params._id).then(function(doc) {
            res.json(200, doc);
        }, function(err) {
            res.json(err.status || 500, err);
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
        SchoolServices.get(req.params._id).then(function(doc) {
            req.body._id = req.params._id;
            SchoolServices.update(req.body).then(function(doc) {
                res.json(200, {});
            }, function(err) {
                res.json(err.status || 500, err);
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

        SchoolServices.remove(req.params._id).then(function(doc) {
            res.json(200, {});
        }, function(err) {
            res.json(500, err);
        });
    };
};

/*
 * GET sync the local menu to remote
 */
exports.syncWeixinMenu = function() {
    return function(req, res) {
        if(!req.params._id) {
            return res.json(400, {error: "id is required."})
        }
        if(!req.query.appId) {
            return res.json(400, {error: "app id is required."})
        }
        if(!req.query.appSecret) {
            return res.json(400, {error: "app secret is required."})
        }

        SchoolServices.syncWeixinMenu(req.params._id, {
            appId: req.query.appId,
            appSecret: req.query.appSecret
        }).then(function(result) {
            res.json(200, result);
        }, function(err) {
            res.json(500, err);
        });
    };
};
