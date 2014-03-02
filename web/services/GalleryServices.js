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
exports.createAsTeacher = function(schoolId, classId, data) {
    var url = conf.site_root + '/api/school/' + schoolId + '/class/' + classId + '/gallery';

    setParms(data);

    return BaseServices.create(url, data, data.createdBy);
}
exports.createAsParent = function(schoolId, studentId, data) {
    var url = conf.site_root + '/api/school/' + schoolId + '/student/' + studentId + '/gallery';

    setParms(data);
    return BaseServices.create(url, data, data.createdBy);
}