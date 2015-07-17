var gulp = require('gulp');
//sourcemaps = require('gulp-sourcemaps'),
//autoprefixer = require('gulp-autoprefixer'),
//livereload = require('gulp-livereload');
var $ = require('gulp-load-plugins')();
var sass = require('gulp-sass');

var browserify = require('browserify');
var babelify = require("babelify");
var watchify = require('watchify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
//var less = require('gulp-less');
var del = require('del');
var browserSync = require('browser-sync').create();

gulp.task("clean", del.bind(
    null, ['.tmp', 'build/*', '!build/.git'], {dot: true}
));

gulp.task("watch", function () {
    //$.livereload.listen();

    var watcher = watchify(browserify({
        entries: ['./src/app.js'],
        transform: [babelify, reactify],
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    }));

    watcher.on('update', function () {
        watcher.bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./build'))
            .pipe(browserSync.reload({stream: true, once: true}));

    }).bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build'));
});

// Static server
gulp.task('bs:start', function () {
    browserSync.init({
        port: 6543,
        server: {
            baseDir: "./build",
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        },
        files: ['./build/index.html']
    });

    gulp.watch("./src/styles/**/*.scss", ['sass']);
});

gulp.task('sass', function () {
    gulp.src('./src/styles/style.scss')
        .pipe($.sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build'));
});

gulp.task('copy', function() {
   gulp.src('./src/index.html')
       .pipe(gulp.dest('./build'));
});

//gulp.task('bs:reload', browserSync.reload);

gulp.task('default', ['watch', 'bs:start', 'sass', 'copy']);

