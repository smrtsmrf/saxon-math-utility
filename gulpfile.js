// Required
var gulp = require('gulp')
var watch = require('gulp-watch')

var babel = require('gulp-babel')

// Extras
var concat = require('gulp-concat')


// File paths - searches each folder (**) and each file in that folder (*)
var paths = {
	jsSource : ['./public/app/app.js', './public/app/**/*.js'],
	cssSource : ['./public/app/**/*.css']
}

// Tasks
gulp.task('css', function () {
	return gulp.src(paths.cssSource)
	.pipe(concat('bundle.css'))
	.pipe(gulp.dest('./public/dist'))
});

gulp.task('js', function () {
	return gulp.src(paths.jsSource)
	.pipe(concat('bundle.js'))
	.pipe(babel({
		"presets" : ["es2015"]
	}))
	.pipe(gulp.dest('./public/dist'))
})

// Watch
gulp.task('watch', function () {
	gulp.watch(paths.jsSource, ['js']);
	gulp.watch(paths.cssSource, ['css']);
})

// Run
gulp.task('default', ['watch', 'js', 'css'])