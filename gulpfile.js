const { src, dest, watch, series, parallel } = require('gulp');
const closureCompiler = require('google-closure-compiler').gulp();
const del = require('del');
const browserSync = require('browser-sync');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');

function cleanDist(done) {
    del.sync(['dist']);
    return done();
}

function minifyHTML() {
    return src('src/*.html')
        .pipe(
            htmlmin({
                collapseWhitespace: true,
            })
        )
        .pipe(dest('dist'));
}

function compile() {
    return src('src/**/*.js')
        .pipe(
            closureCompiler({
                compilation_level: 'ADVANCED',
                warning_level: 'VERBOSE',
                language_out: 'ECMASCRIPT6',
                js_output_file: 'app.min.js',
            })
        )
        .pipe(dest('dist'));
}

function compileDev() {
    return src('src/**/*.js').pipe(concat('app.min.js')).pipe(dest('dist'));
}

function startServer(done) {
    browserSync.init({
        server: {
            baseDir: './dist/',
        },
    });
    done();
}

function reloadBrowser(done) {
    browserSync.reload();
    done();
}

function watchSource(done) {
    watch('src/**/*', series(exports.default, reloadBrowser));
    done();
}

exports.build = series(cleanDist, parallel(minifyHTML, compile));
exports.default = series(cleanDist, parallel(minifyHTML, compileDev));
exports.watch = series(exports.default, startServer, watchSource);
