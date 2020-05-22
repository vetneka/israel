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
        imagemin.svgo()
      ]))
      .pipe(gulp.dest('source/assets/img'));

});

gulp.task('webp', function () {
  return gulp.src('source/assets/img/**/*.{png,jpg}')
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest('source/assets/img'));
});

gulp.task('svgSprite', function () {
  return gulp.src('source/assets/img/icons/svg/icon-*.svg')
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename('svg-sprite.svg'))
      .pipe(gulp.dest('build/assets/img'));
});

gulp.task('spriteDefault', function () {
  var spriteData = gulp.src(['source/assets/img/icons/*.png', '!source/assets/img/icons/*@2x.png'])
      .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        padding: 5
      }));
  return spriteData.pipe(gulp.dest('build/assets/img/'));
});

gulp.task('spriteRetina', function () {
  var spriteData = gulp.src('source/assets/img/icons/*@2x.png')
      .pipe(spritesmith({
        imgName: 'sprite@2x.png',
        cssName: 'sprite.css',
        padding: 5
      }));
  return spriteData.pipe(gulp.dest('build/assets/img/'));
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
    'source/assets/img/**',
    'source/js/**',
  ], {
    base: 'source'
  })
      .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('sprite', gulp.series('spriteDefault', 'spriteRetina', 'svgSprite'));

gulp.task('build', gulp.series('clean', 'copy', 'css', 'sprite', 'html'));
gulp.task('start', gulp.series('build', 'server'));

