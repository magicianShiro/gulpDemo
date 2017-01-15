'use strict';
const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-minify-css-mpath');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const pump = require('pump');


// 压缩html
gulp.task('html',function(cb){
    pump([
        gulp.src('./src/index.html'),
        htmlmin({
            collapseWhitespace: true,
            removeComments:true
        }),
        gulp.dest('./dist/'),
        browserSync.reload({
            stream:true
        })
    ],cb)
});

// 压缩 css
gulp.task('style',function(cb){
    pump([
        gulp.src(['./src/styles/*.less','!./src/styles/_*.less']),
        // 先解析less
        less(),
        // 压缩 (一个选择器一行)
        minifyCSS({keepBreaks:true}),
        gulp.dest('./dist/styles/'),
        browserSync.reload({
            stream:true
        })
    ],cb)
});

// 合并js 并且混淆
gulp.task('script',function(cb){
    pump([
        gulp.src('./src/scripts/*.js'),
        // 合并
        concat('all.js'),
        // 压缩 混淆
        uglify(),
        gulp.dest('./dist/scripts/'),
        browserSync.reload({
            stream:true
        })
    ],cb)
});
// 压缩图片
gulp.task('image',function(cb){
    pump([
        gulp.src('./src/images/*.*'),
        imagemin(),
        gulp.dest('./dist/images/'),
        browserSync.reload({
            stream:true
        })
    ],cb);
});
// 同步
gulp.task('serve',function(cb){
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    // 监听
    gulp.watch('./src/index.html',['html']);
    gulp.watch('./src/styles/*.less',['style']);
    gulp.watch('./src/scripts/*.js',['script']);
    gulp.watch('./src/images/*.*',['image']);
});


// 默认执行
gulp.task('default',['html','style','script','image','serve']);