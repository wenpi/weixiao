var mysql = require('mysql');
var conf = require("../conf");
var Q = require("q");

var pool  = mysql.createPool({
  host: conf.mysql.host,
  user: conf.mysql.user,
  password: conf.mysql.password,
  database: conf.mysql.database
});

module.exports.query = function(sql) {
    var deferred = Q.defer();

	pool.getConnection(function(err, connection) {
		if (err) {
			return deferred.reject(err);
		}

		console.info(sql);
		connection.query(sql, function(err, rows) {
			if (err) {
				return deferred.reject(err);
			}
			deferred.resolve(rows);
		});

	});

	return deferred.promise;
}

module.exports.get = function(sql) {
    var deferred = Q.defer();

	pool.getConnection(function(err, connection) {
		if (err) {
			return deferred.reject(err);
		}

		console.info(sql);
		connection.query(sql, function(err, rows) {
			if (err) {
				return deferred.reject(err);
			}
			if (!rows || rows.length !== 1) {
				return deferred.reject(new Error("faile to get the data with ID"));
			}
			deferred.resolve(rows[0]);
		});

	});

	return deferred.promise;
}