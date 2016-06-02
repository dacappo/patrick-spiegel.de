var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rsync = require('gulp-rsync');
var del = require('del');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var critical = require('critical').stream;

// Clean build directory
gulp.task('clean', function() {
  return del(['build/**/*']);
});

// Combine and minify scripts and stylesheets
gulp.task('combine', function () {
  var assets = useref.assets();
	        
  return gulp.src('index.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('build/'));
});

// Minify HTML pages
gulp.task('minify-html', ['combine'], function() {
  return gulp.src('build/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
});

// Minify imgaes
gulp.task('minify-img', function() {
  return gulp.src('img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('build/img/'));
});

// Copy all fonts to build directory
gulp.task('copy-fonts', function() {
  return gulp.src(['fonts/**/*', 'bower_components/font-awesome/fonts/**/*'])
      .pipe(gulp.dest('build/fonts/'));
});

// Copy favicon to build directory
gulp.task('copy-favicon', function() {
  return gulp.src('favicon.*')
      .pipe(gulp.dest('build/'));
});

gulp.task('critical', ['combine', 'minify-html'], function() {
  return gulp.src('build/*.html')
      .pipe(critical({base: 'build/', inline: true, css: ['build/css/combined.css']}))
      .pipe(gulp.dest('build'));
});

// Main build task
gulp.task('build', ['copy-favicon', 'copy-fonts', 'combine', 'minify-html', 'minify-img', 'critical']);

// Define deploy to webserver
gulp.task('deploy', function() {
  gulp.src(['build/'])
    .pipe(rsync({
      root: 'build',
      hostname: 'patrick@patrick-spiegel.de',
      destination: '/var/www/html/',
      progress: true,
      recursive: true
    }))
});
