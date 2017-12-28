var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnext = require('postcss-cssnext');
var precss = require('precss');
var sass = require('gulp-sass');

// 添加引用
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');


gulp.task('css', function () {
    var processors = [cssnext, precss];
    return gulp.src('./public/stylesheets/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./public/stylesheets'));
})

gulp.task('node', function () {
    nodemon({
        script: './bin/www',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    })
})

gulp.task('server', ['node'], function () {
    var files = [
        'views/*.pug',
        'views/*.ejs',
        'views/*.html',
        'public/dest/*.css'
    ];
    browserSync.init(files, {
        proxy: 'http://localhost:3000',
        browser: 'chrome',
        notify: false,
        port: 4000
    });
    gulp.watch('./public/stylesheets/style.scss', ['css'])
    gulp.watch(files).on('change', reload)
})



gulp.task('watch', function () {
    gulp.watch('./public/stylesheets/style.scss', ['css'])
})