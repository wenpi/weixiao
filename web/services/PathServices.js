var Q = require("q");
var BaseServices = require("./BaseServices");
var conf = require("../conf");
var request = require('request');

function setParms(data) {
    if (!data.photos) { return; }
    for (var i=0; i<data.photos.length; i++) {
        data['wxphotos['+i+']'] = data.photos[i];
    }
    delete data.photos;
}
exports.create = function(schoolId, studentId, data) {
    var url = conf.site_root + '/api/school/' + schoolId + '/student/' + studentId + '/path';
    console.info(url);
    console.info(data);

    setParms(data);
    return BaseServices.create(url, data, data.createdBy);
}