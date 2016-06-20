/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require("gulp");
var gulpTypings = require("gulp-typings");
var rimraf = require("rimraf");
var watch = require("gulp-watch");
var less = require("gulp-less-sourcemap");
var flatten = require("gulp-flatten");
var util = require("gulp-util");
var path = require("path");

var paths = {
    less: {
        source: ["./wwwroot/app/site.less", "./wwwroot/calendar/styles/calendar.less"],
        watch: "./wwwroot/**/*.less"
    }
};

gulp.task("typings", function () {
    var stream = gulp.src("./typings.json")
        .pipe(gulpTypings()); //will install all typingsfiles in pipeline. 
    return stream;
});

gulp.task("less", function () {
    for (var i = 0; i < paths.less.source.length; i++) {
        var dest = path.dirname(paths.less.source[i]);
        gulp.src(paths.less.source[i])
            .pipe(less().on("error", util.log))
            .pipe(gulp.dest(dest));
    }
});

gulp.task("watch:less", function () {
    return gulp.watch(paths.less.watch, ["less"]);
});


gulp.task("clean:less", function (cb) {
    rimraf(paths.less.dest, cb);
});

gulp.task("clean:typings", function (cb) {
    rimraf("./typings", cb);
});

gulp.task("clean", ["clean:less", "clean:typings"]);