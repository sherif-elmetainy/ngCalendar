/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require("gulp");
var gulpTypings = require("gulp-typings");
var rimraf = require("rimraf");
var watch = require("gulp-watch");
var less = require("gulp-less-sourcemap");
var util = require("gulp-util");
var path = require("path");
var typescript = require("gulp-typescript");
var Builder = require("systemjs-builder");
var inlineNg2Template = require("gulp-inline-ng2-template");
var merge = require("merge2");
var sourcemaps = require("gulp-sourcemaps");
var filter = require('gulp-filter');
var htmlMinifier = require("html-minifier");
var rename = require("gulp-rename");

var paths = {
    less: {
        source: ["./app/site.less", "./calendar/styles/calendar.less"],
        watch: "./**/*.less"
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

gulp.task("watch:less", ["less"], function () {
    return gulp.watch(paths.less.watch, ["less"]);
});


gulp.task("clean:less", function (cb) {
    rimraf("./{calendar,app}/**/*.{css,css.map}", cb);
});

gulp.task("clean:typings", function (cb) {
    rimraf("./typings", cb);
});

gulp.task("clean:build", function (cb) {
    rimraf("./build", cb);
});

gulp.task("clean:tsc:defs", function (cb) {
    rimraf("definitions", cb);
});

gulp.task("clean:tsc:js", function (cb) {
    rimraf("./{calendar,app}/**/*.{js,js.map,d.ts}", cb);
});

gulp.task("clean", ["clean:less", "clean:typings", "clean:build", "clean:tsc:defs", "clean:tsc:js"]);

function minifyTemplate(ext, file, cb) {
    try {
        var minifiedFile = htmlMinifier.minify(file, {
            collapseWhitespace: true,
            caseSensitive: true,
            removeComments: true,
            removeRedundantAttributes: true
        });
        cb(null, minifiedFile);
    }
    catch (err) {
        cb(err);
    }
}

function build(expressionOrTree, outputFile, minify, inlineTemplates, sfx, cb) {
    var builder = new Builder("./", "./systemjs.config.js");
    var out = "./dist/" + outputFile + (minify ? ".min" : "") + ".js";
    if (inlineTemplates) {
        builder.config({
            packages: {
                calendar: {
                    defaultExtension: "inline.js"
                },
                app: {
                    defaultExtension: "inline.js"
                }
            }
        });
    }
    var result;
    if (sfx)
        result = builder.buildStatic(expressionOrTree, out, { minify: minify });
    else
        result = builder.bundle(expressionOrTree, out, { minify: minify });
    result = result.then(function () {
        cb();
    });
    result.catch(function (err) {
        console.log(err);
        cb(err);
    });
}

gulp.task("build:static", ["tsc:inlinejs"], function (cb) {
    build("app", "app", true, true, true, cb);
});

gulp.task("build:deps", ["tsc:inlinejs"], function (cb) {
    build("app - [app/**/*] - [calendar/**/*]", "deps", true, false, false, cb);
});

gulp.task("build:calendar", ["tsc:inlinejs"], function (cb) {
    build("calendar - (calendar - [calendar/**/*])", "calendar", true, true, false, cb);
});

gulp.task("build:depsDev", ["tsc:inlinejs"], function (cb) {
    build("app - [app/**/*] - [calendar/**/*]", "deps", false, false, false, cb);
});

gulp.task("build:calendarDev", ["tsc:inlinejs"], function (cb) {
    build("calendar - (calendar - [calendar/**/*])", "calendar", false, true, false, cb);
});

gulp.task("build", ["build:deps", "build:depsDev", "build:calendar", "build:calendarDev", "build:static"]);

gulp.task("tsc:defs", function () {
    var tsProject = typescript.createProject("./tsconfig.json", { sortOutput: true });
    var result = tsProject.src() // instead of gulp.src(...) 
        .pipe(typescript(tsProject));
    var f = filter(["**/*.d.ts", "!app/*"]);
    result.dts.pipe(f).pipe(gulp.dest("definitions"));
});

gulp.task("tsc:js", function () {
    var tsProject = typescript.createProject("./tsconfig.json", { sortOutput: true });
    var result = tsProject.src() // instead of gulp.src(...) 
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

    var f = filter(["**/*.js"]);
    result.js.pipe(f)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./"));
});

gulp.task("tsc:inlinejs", function () {
    var tsProject = typescript.createProject("./tsconfig.json", { sortOutput: true });
    var result = tsProject.src() // instead of gulp.src(...) 
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

    var f = filter(["**/*.js"]);
    result.js.pipe(f)
        .pipe(sourcemaps.write())
        .pipe(inlineNg2Template({
            base: "./",
            css: false,
            target: "es5",
            templateProcessor: minifyTemplate
        }))
        .pipe(rename(function (path) {
            path.extname = ".inline.js";
            return path;
        }))
        .pipe(gulp.dest("./"));
});

gulp.task("watch:tsc", ["tsc:js"], function () {
    return gulp.watch("./{app,calendar}/**/*.ts", ["tsc:js"]);
});

gulp.task("watch", ["watch:tsc", "watch:less"]);