var Q = require("q");
var conf = require("../conf");
var MysqlServices = require("./MysqlServices");
var request = require('request');

/*
 * 查询数据
 */
function queryBySchoolId(opts){
    var schoolId = opts.schoolId || '-1';
    var sql = [
        "SELECT * FROM wex_class WHERE school_id = '" + schoolId + "' order by code asc"
    ];
    return MysqlServices.query(sql.join(" "));
    //return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
};
exports.queryBySchoolId = queryBySchoolId;