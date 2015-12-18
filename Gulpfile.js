'user strict';

var browserify = require('browserify');

var gulp = require('gulp'); // gulp build source
var env = require('gulp-env');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var del = require('del'), // delate old file
    jshint = require('gulp-jshint'), // hint error in your code
    concat = require('gulp-concat'), // concatenated multiple file to one file
    rimraf = require('gulp-rimraf'), // delte some file in folder

    //sass 
    minifyCss = require('gulp-minify-css'), //
    autoprefixer = require('gulp-autoprefixer');

// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

// Set up an express server (not starting it yet)
var server = express();

server.use('/bower', express.static('./bower_components'));
server.use(express.static('./dist'));

server.all('*', function(req, res) {
    res.sendFile('index.html', {
        root: 'dist'
    });
});

var bowerComponents = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-strap/dist/angular-strap.js',
    'bower_components/angular-strap/dist/angular-strap.tpl.js',
    'bower_components/angular-local-storage/dist/angular-local-storage.js',

    'bower_components/bootstrap/dist/js/bootstrap.js'
];

var stylesComponents = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/bootstrap/dist/css/bootstrap-theme.css',
    'bower_components/font-awesome-4.3.0/css/font-awesome.css',
    'bower_components/angular-ui-select/dist/select.css'
];

var fontsComponents = [
    'bower_components/bootstrap/dist/fonts/*',
    'bower_components/font-awesome/fonts/*',
    'app/assets/fonts/*'
];
var imagesComponents = [
    'app/assets/images/**'
];



gulp.task('clean', function() {
    del.sync(['dist']);
    gulp.src('./dist/views', {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

// JSHint task
gulp.task('lint', function() {
    gulp.src(['app/scripts/*.js', 'app/scripts/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Styles task
gulp.task('styles', function() {
    if (process.env.NODE_ENV == 'production') {
        gulp.src(stylesComponents)
            // Optionally add autoprefixer
            .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
            .pipe(minifyCss())
            .pipe(concat('libs.min.css'))
            // These last two should look familiar now :)
            .pipe(gulp.dest('dist/css/'));
    }
});


// Styles task
gulp.task('css', function() {

    switch (process.env.NODE_ENV) {
        case 'development':
            gulp.src('app/assets/styles/**')
                // Will be put in the dist/views folder
                .pipe(gulp.dest('dist/css/'));
            break;
        case 'production':
            gulp.src('app/assets/styles/*.css')
                // Optionally add autoprefixer
                .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
                .pipe(minifyCss())
                .pipe(concat('bundle.min.css'))
                // These last two should look familiar now :)
                .pipe(gulp.dest('dist/css/'));
            break;
        default:
            break;
    }

});
// Font task
gulp.task('fonts', function() {
    return gulp.src(fontsComponents)
        .pipe(gulp.dest('dist/fonts/'));
});

// Image task
gulp.task('images', function() {
    return gulp.src(imagesComponents)
        .pipe(gulp.dest('dist/images/'));
});

// Browserify task
gulp.task('browserify', function() {
    if (process.env.NODE_ENV == 'production') {
        // All lib files in bower components folder
        gulp.src(bowerComponents)
            .pipe(concat('libs.min.js'))
            .pipe(uglify({
                mangle: false
            }))
            .pipe(gulp.dest('dist/js'));
    }

});
gulp.task('javascript', function() {
    return browserify({
            entries: ['app/scripts/main.js'],
            debug: true
        })
        .bundle()

    .pipe(source('bundle.min.js'))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('views', function() {
    switch (process.env.NODE_ENV) {
        case 'development':
            // Get our index.html
            gulp.src('app/basic.html')
                .pipe(rename('index.html'))
                // And put it in the dist folder
                .pipe(gulp.dest('dist/'));

            // Any other view files from app/views
            gulp.src('app/views/**/*.html')
                // Will be put in the dist/views folder
                .pipe(gulp.dest('dist/views/'));
            break;
        case 'production':
            // Get our index.html
            gulp.src('app/index.html')
                // And put it in the dist folder
                .pipe(gulp.dest('dist/'));

            // Any other view files from app/views
            gulp.src('app/views/**/*.html')
                // Will be put in the dist/views folder
                .pipe(gulp.dest('dist/views/'));
            break;
        default:
            break;
    }
});

gulp.task('watch', ['lint'], function() {
    // Start webserver
    server.listen(serverport);
    // Start live reload
    refresh.listen(livereloadport);

    // Watch our scripts, and when they change run lint and browserify
    gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'], [
        'lint',
        'javascript'
    ]);
    // Watch our css files
    gulp.watch(['app/assets/styles/*.css'], [
        'css'
    ]);

    gulp.watch(['app/**/*.html'], [
        'views'
    ]);

    gulp.watch(['app/assets/images/*'], [
        'images'
    ]);

    gulp.watch('./dist/**').on('change', refresh.changed);
});

gulp.task('set-env-prod', function() {
    env({
        vars: {
            NODE_ENV: 'production',
            port: '80'
        }
    })
});

// Dev task
gulp.task('prod', ['set-env-prod', 'clean', 'views', 'images', 'fonts', 'styles', 'css', 'lint', 'browserify', 'javascript'], function() {});


gulp.task('default', ['prod', 'watch']);
