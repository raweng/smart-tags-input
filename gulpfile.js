var gulp        = require('gulp');
var browserify  = require('browserify');
var streamify 	= require('gulp-streamify')
var $           = require('gulp-load-plugins')();
var del         = require('del');
var runSequence = require('run-sequence');
var source      = require('vinyl-source-stream');

gulp.task('clean:dist',function(){
	return del(['dist']);
})


gulp.task('bundle:build-min',function(){

	return browserify('./bin/export.js')
			.bundle()
			.pipe(source('smart-tags-input.min.js'))
			.pipe(streamify($.uglify()))
			.pipe(gulp.dest('./dist/'));
})

gulp.task('bundle:build',function(){

	return browserify('./bin/export.js')
			.bundle()
			.pipe(source('smart-tags-input.js'))
			// .pipe(streamify($.uglify()))
			.pipe(gulp.dest('./dist/'));
})

gulp.task('bundle:serve',function(){

	return browserify('./bin/export.js')
			.bundle()
			.pipe(source('smart-tags-input.js'))
			// .pipe(streamify($.uglify()))
			.pipe(gulp.dest('./test/'));
})

gulp.task('copy:css',function(){
	return gulp.src('./bin/style.css')
	.pipe(gulp.dest('./test/'));
})

gulp.task('webserver',function(){
	 gulp.src(['test','dist'])
    .pipe($.webserver({
      host: 'localhost', //change to 'localhost' to disable outside connections
      livereload: {
        enable: true,
        filter: function(filePath) {
          if (/bin\\[a-z]+[.]js/.test(filePath)) {
            $.util.log('Ignoring', $.util.colors.magenta(filePath));
            return false;
          } else {
            return true;
          }
        }
      },
      open: true
    }));
})

gulp.task('serve',function(){
	runSequence('clean:dist','bundle:serve','copy:css','webserver');
	gulp.watch('bin/*.js',['bundle:serve']);
	gulp.watch('dist/**/*.js',['bundle:serve']);
	gulp.watch('bin/*.css',['copy:css']);

})

gulp.task('build',function(){
	runSequence('clean:dist','bundle:build','bundle:build-min');
})



