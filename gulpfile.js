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

gulp.task('clean', function() {
  return del(['build/**/*']);
});

gulp.task('minify-html', function(){
  return gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
});

gulp.task('minify-img', function() {
  return gulp.src('img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('build/img/'));
});

gulp.task('minify-js', function() {
  return gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'));
});

gulp.task('minify-css', function() {
  return gulp.src('css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css/'))
});

gulp.task('copy-bower', function() {
  return gulp.src('bower_components/**/*')
      .pipe(gulp.dest('build/bower_components/'));
});

gulp.task('copy-favicon', function() {
  return gulp.src('favicon.*')
      .pipe(gulp.dest('build/'));
});

gulp.task('copy',['copy-bower','copy-favicon']);

gulp.task('build', ['copy', 'combine', 'minify-img']);

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
