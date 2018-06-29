const gulp = require('gulp');
const sass = require('gulp-sass');
const connect = require('gulp-connect');
const concat = require('gulp-concat');

// Create Local Web Server
gulp.task('webserver', () => {
  connect.server({
    root: 'src',
    livereload: true,
    port: 8000,
    host: '0.0.0.0',
  });
});

/*
 * Development Tasks
 */
// Compile SASS code to styles.css
gulp.task('build:sass', () => {
  return gulp
    .src('src/sass/**/*.scss')
    .pipe(
      sass({
        includePaths: 'src/sass',
      }).on('error', sass.logError)
    )
    .pipe(concat('style.css'))
    .pipe(gulp.dest('src/css'))
    .pipe(connect.reload());
});


// Watch for changes to sass
gulp.task('watch', ['build:sass'], () => {
  gulp.watch(['src/sass/**/*.scss'], ['build:sass']);
});

gulp.task('default', ['build:sass', 'webserver', 'watch']);
