"use strict";

// dependencies
var path          = require("path");
var fse           = require("fs-extra");
var child_process = require("child_process");

var gulp    = require("gulp");
var less    = require("gulp-less");
var sass    = require("gulp-sass");
var vstream = require("vinyl-source-stream");
var buffer  = require("vinyl-buffer");

// constants
var CONFIG_FILES = ["_config.yml", "_defaults.yml"];
var JEKYLL_FLAGS = ["--trace", "--config", CONFIG_FILES.join(",")];

var SOURCE_DIR  = "www";
var BIN_DIR     = path.join("tools", "bin");
var DATA_DIR    = path.join(SOURCE_DIR, "_data");
var DOCS_DIR    = path.join(SOURCE_DIR, "docs");
var CSS_SRC_DIR = path.join(SOURCE_DIR, "static", "css-src");
var CSS_DIR     = path.join(SOURCE_DIR, "static", "css");
var BUILD_DIR   = "public";

// helpers
function execPiped(command, args, fileName) {
    console.log(command + " " + args.join(" "));
    var task = child_process.spawn(command, args);
    return task.stdout.pipe(vstream(fileName)).pipe(buffer());
}

function exec(command, args, cb) {
    console.log(command + " " + args.join(" "));
    var task = child_process.spawn(command, args, {stdio: "inherit"});
    task.on("exit", cb);
}

function bin(name) {
    return path.join(BIN_DIR, name);
}

// tasks
gulp.task("default", function () {
    gulp.run("lr-server", "scripts", "styles", "html");

    gulp.watch("app/src/**", function(event) {
        gulp.run("scripts");
    })

    gulp.watch("app/css/**", function(event) {
        gulp.run("styles");
    })

    gulp.watch("app/**/*.html", function(event) {
        gulp.run("html");
    })
});

gulp.task("build", ["defaults", "languages", "toc", "styles"], function (done) {
    exec("jekyll", ["build"].concat(JEKYLL_FLAGS), done);
});

gulp.task("serve", ["defaults", "languages", "toc", "styles"], function (done) {
    exec("jekyll", ["serve", "--watch"].concat(JEKYLL_FLAGS), done);
});

gulp.task("defaults", function () {
    execPiped("python", [bin("gen_defaults.py"), DOCS_DIR], "_defaults.yml")
        .pipe(gulp.dest("."));
});

gulp.task("languages", function () {
    execPiped("python", [bin("gen_languages.py"), DOCS_DIR], "languages.yml")
        .pipe(gulp.dest(DATA_DIR));
});

gulp.task("toc", function (done) {
    exec("python", [bin("gen_toc.py"), SOURCE_DIR], done);
});

gulp.task("styles", function() {

    gulp.src(path.join(CSS_SRC_DIR, "**", "*.less"))
        .pipe(less())
        .pipe(gulp.dest(CSS_DIR));

    gulp.src(path.join(CSS_SRC_DIR, "**", "*.css"))
        .pipe(gulp.dest(CSS_DIR));

    gulp.src(path.join(CSS_SRC_DIR, "**", "*.scss"))
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(CSS_DIR));
});

// convenience tasks
gulp.task("link-bugs", function (done) {
    exec(bin("linkify-bugs.sh"), [path.join(SOURCE_DIR, "_posts")], done);
});

gulp.task("clean", function () {
    fse.remove(BUILD_DIR);
    fse.remove(path.join(DATA_DIR, "toc", "*.yml"));
    fse.remove(path.join(DATA_DIR, "languages.yml"));
    fse.remove(path.join(CSS_DIR));
    fse.remove("_defaults.yml");
});