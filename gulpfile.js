var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var gutil = require('gulp-util');
var webpack = require('webpack');

gulp.task('concat', function() {

});

var sassPaths = [
	'bower_components/foundation-sites/scss'
	// 'bower_components/motion-ui/src'
];

gulp.task('sass', function() {
	return gulp.src('./sass/*.scss')
		// Init source maps
		.pipe($.sourcemaps.init())
		// SASS it up
		.pipe($.sass({
			includePaths: sassPaths,
			outputStyle: 'expanded'
		})
		.on('error', $.sass.logError))
		// Autoprefix
		.pipe($.autoprefixer({
			browsers: ['last 2 versions', 'ie >= 8']
		}))
		// Minify
		.pipe($.cssnano({
			minifyFontValues: true,
			calc: {
				precision: 3
			}
		}))
		// Write sourcemaps
	    .pipe($.sourcemaps.write('.'))
		// Output to CSS folder
	    .pipe(gulp.dest('./css'));
});

gulp.task('watch', ['sass'], function() {
	gulp.watch(
		['./sass/**/*.scss'],
		['sass']
	);
});

// Define the configuration for the webpack `build` task
var buildTaskConfiguration = {
	entry: './src/EntryPoint.js',
	output: {
		path: 'js',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader?optional=runtime&stage=0',
				exclude: /node_modules/,
				include:/src/
			}
		]
	}
};

gulp.task('build', function(callback) {
	// Run webpack using the build configuration defined
	webpack(buildTaskConfiguration, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack', err);
		gutil.log('[webpack]', stats.toString({}));
		callback();
	});
});


//hotel view js - Define the configuration for the webpack `build` task
var buildHotelTaskConfiguration = {
	entry: './src/EntryPointHotel.js',
	output: {
		path: 'js',
		filename: 'bundle-hotel.js'
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader?optional=runtime&stage=0',
				exclude: /node_modules/,
				include:/src/
			}
		]
	}
};

gulp.task('build-hotel', function(callback) {
	// Run webpack using the build configuration defined
	webpack(buildHotelTaskConfiguration, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack', err);
		gutil.log('[webpack]', stats.toString({}));
		callback();
	});
});
