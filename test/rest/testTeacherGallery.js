var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test teacher gallery api : ', function(){
        var schoolId = null;
        // 能获得学校数据
        it('success to get a school data for gallery module with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPagingList("/api/school", {token: 'basic-valid'})
                    .then(function(schools) {
                        assert.notEqual(0, schools.length);
                        schoolId = schools[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能获得教师ID
        var teacherId = 0;
        it('success to get teacher data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher", {token: 'basic-valid'})
                    .then(function(teahcers) {
                        assert.notEqual(0, teahcers.length);
                        teacherId = teahcers[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能获得班级id
        var classId;
        it('success to get class data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class", {token: 'basic-valid'})
                    .then(function(wexclasses) {
                        assert.notEqual(0, wexclasses.length);
                        classId = wexclasses[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除关系，无论成功与否
        it('success to delete the reference between class and teacher', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + "/class/" + classId + "/teacher/" + teacherId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token,该教师无法向这个班级提交班级圈记录
        it('failed to create gallery data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/class/' + classId + '/gallery', 
                        {title: '测试班级圈记录'}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not create a gallery"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 即使有token,该教师依然无法向这个班级提交班级圈记录
        it('failed to create gallery data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/class/' + classId + '/gallery', 
                        {title: '测试班级圈记录', createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a gallery"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 增加绑定
        it('success to create the reference between class and teacher', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/teacher/" + teacherId, {user: teacherId})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should assgin a teacher to a class"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token无法获得班级圈记录列表
        it('failed to get the total gallery of the class without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/gallery", {token: 'basic-none'})
                    .then(function(gallerys) {
                        callback(new Error("should not get the gallery"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 获得通知的总数
        var count = tCount = 0;

        it('success to get the total gallery of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/gallery", {token: 'basic-valid'})
                    .then(function(gallerys) {
                        count = gallerys.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the total gallery of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher/" + teacherId + "/gallery", {token: 'basic-valid'})
                    .then(function(gallerys) {
                        tCount = gallerys.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 获得photoId
        var photoId
        it('success to create photo data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/teacher/' + teacherId + '/photo', 
                        {path: 'teacherpic', createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function(id) {
                        photoId = id;
                        done();
                    }, function(err) {
                        callback(new Error("should create a photo"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能提交一条班级圈记录
        var galleryId;
        it('success to create gallery data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/gallery", 
                        {title: '普通班级圈记录', 'photos[0]': photoId, createdBy: teacherId}, {user: teacherId})
                    .then(function(id) {
                        galleryId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a gallery"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get gallery detail with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/school/" + schoolId + "/gallery/" + galleryId, {user: teacherId})
                    .then(function(gallery) {
                        assert.equal(galleryId, gallery.id);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get a gallery"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 总数加一 且附件数为1
        var attachmentId;
        it('success to get a newer total gallery of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/gallery", {token: 'basic-valid'})
                    .then(function(gallerys) {
                        assert.equal(count + 1, gallerys.length);
                        var photos = gallerys[0].photos;
                        assert.equal(1, photos.length);
                        attachmentId = photos[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get a newer total gallery of the teacher with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher/" + teacherId + "/gallery", {token: 'basic-valid'})
                    .then(function(gallerys) {
                        assert.equal(tCount + 1, gallerys.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 无法删除附件
        it('failed to remove the attachment without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/gallery/' + galleryId + '/attachment/' + attachmentId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove a attachment"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除附件成功
        it('success to remove the gallery with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/gallery/' + galleryId + '/attachment/' + attachmentId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should remove a attachment"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get a newer attachment of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/gallery", {token: 'basic-valid'})
                    .then(function(gallerys) {
                        assert.equal(count + 1, gallerys.length);
                        var photos = gallerys[0].photos;
                        assert.equal(0, photos.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 无法删除班级圈记录
        it('failed to remove the gallery without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/gallery/' + galleryId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove a gallery"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除班级圈记录
        it('success to remove the gallery with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/gallery/' + galleryId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should remove a gallery"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });


    });
}