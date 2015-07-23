var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rsync = require('gulp-rsync');

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

gulp.task('build', ['minify-html', 'minify-img', 'minify-css', 'minify-js']);

gulp.task('deploy', function() {
  gulp.src('build/*')
    .pipe(rsync({
      root: 'build',
      hostname: 'patrick@patrick-spiegel.de',
      destination: '/var/www/html/',
      progress: true
    }))
});
