'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var svgstore = require('gulp-svgstore');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var del = require('del');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');

gulp.task('css', function () {
  return gulp.src('source/sass/style.scss')
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass())
      .pipe(postcss([autoprefixer()]))
      .pipe(csso())
      .pipe(rename('style.min.css'))
      .pipe(sourcemap.write('.'))
      .pipe(gulp.dest('build/css'))
      .pipe(server.stream());
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/img/icon-*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/assets/**/*', gulp.series('copy', 'refresh'));
  gulp.watch('source/**/*.js', gulp.series('scripts', 'refresh'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('images', function () {
  return gulp.src('source/assets/img/**/*.{png,jpg,svg}')
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true}),
        // imagemin.svgo()
      ]))
      .pipe(gulp.dest('build/assets/img'));
});

gulp.task('webp', function () {
  return gulp.src('source/assets/img/img-*.{png,jpg}')
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest('build/assets/img'));
});

gulp.task('svgSprite', function () {
  return gulp.src('source/assets/img/icons/svg/icon-*.svg')
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename('svg-sprite.svg'))
      .pipe(gulp.dest('source/assets/img'));
});

gulp.task('spritePng', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('source/assets/img/icons/*.png')
      .pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../assets/img/sprite.png',
        cssName: 'sprite.scss',
        retinaSrcFilter: 'source/assets/img/icons/*@2x.png',
        retinaImgName: 'sprite@2x.png',
        retinaImgPath: '../assets/img/sprite@2x.png',
        padding: 10,
      }));

  // Pipe image stream onto disk
  var imgStream = spriteData.img
      .pipe(gulp.dest('source/assets/img/'));

  // Pipe CSS stream onto disk
  var cssStream = spriteData.css
      .pipe(gulp.dest('source/sass/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

gulp.task('html', function () {
  return gulp.src('source/*.html')
      .pipe(posthtml([
        include()
      ]))
      .pipe(gulp.dest('build'));
});

gulp.task('copy', function () {
  return gulp.src([
    'source/assets/fonts/**/*.{woff,woff2}',
    // 'source/assets/img/**',
    // 'source/js/**',
  ], {
    base: 'source'
  })
      .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('scripts', function () {
  return gulp.src('source/script.js')
    .pipe(plumber())
    .pipe(webpackStream(require('./webpack.config.js')))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('sprite', gulp.series('spritePng', 'svgSprite'));

gulp.task('dev', gulp.series('clean', 'css', 'sprite', 'copy', 'scripts', 'html', 'server'));
gulp.task('build', gulp.series('clean', 'css', 'copy', 'images', 'webp', 'sprite', 'scripts', 'html'));
gulp.task('start', gulp.series('build', 'server'));
