var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    fileinclude = require('gulp-file-include');

var browserSync = require('browser-sync').create();

var PATHS = {
    src: {
        base: './src',
        html: './src/*.html',
        templates: './src/templates',
        js: './src/js/main.js',
        scss: './src/scss/main.scss',
        fonts: './src/assets/fonts/*',
        images: './src/assets/images/*'
    },
    build: {
        base: './build',
        js: './build/js',
        css: './build/css',
        images: './build/assets/images',
        fonts: './build/assets/fonts'
    },
    watch: {
        html: './src/**/*.html',
        scss: './src/**/*.scss',
        js: './src/js/**/*.js',
        images: './src/assets/images/*',
        fonts: './src/assets/fonts/*'
    },
    del: './build/*'
}

function html() {
    return gulp.src(PATHS.src.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: PATHS.src.templates
        }))
        .pipe(gulp.dest(PATHS.build.base))
        .pipe(browserSync.stream());
}

function styles() {
    return gulp.src(PATHS.src.scss)
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(cleanCss())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest(PATHS.build.css))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(PATHS.src.js)
        .pipe(rename('scripts.js'))
        .pipe(sourcemaps.init())
        .pipe(browserify({ insertGlobals: false, toplevel: true }))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATHS.build.js))
        .pipe(browserSync.stream());
}

function images() {
    return gulp.src(PATHS.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(PATHS.build.images))
}

function fonts() {
    return gulp.src(PATHS.src.fonts)
        .pipe(gulp.dest(PATHS.build.fonts));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: PATHS.build.base
        }
    });
    gulp.watch(PATHS.watch.html, html);
    gulp.watch(PATHS.watch.scss, styles);
    gulp.watch(PATHS.watch.js, scripts);
    gulp.watch(PATHS.watch.images, images);
    gulp.watch(PATHS.watch.fonts, fonts);
}

function clean() {
    return del([PATHS.del])
}

gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('js', scripts);
gulp.task('clean', clean);
gulp.task('images', images);
gulp.task('fonts', fonts);

gulp.task('build', gulp.series(clean, gulp.parallel(html, images), gulp.parallel(styles, scripts), fonts))
gulp.task('start', gulp.series('build', watch))
