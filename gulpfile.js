const { src, dest, watch, series, parallel } = require('gulp');
const closureCompiler = require('google-closure-compiler').gulp();
const del = require('del');
const browserSync = require('browser-sync');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const zip = require('gulp-zip');
const cleanCSS = require('gulp-clean-css');

function cleanDist(done) {
    del.sync(['dist']);
    return done();
}

function archive() {
    const d = new Date();
    const version = `${d.getMonth() + 1}_${d.getDate()}_${d.getHours()}`;
    return src('dist/**/*')
        .pipe(zip(`app_${version}.zip`))
        .pipe(dest('submission'));
}

function minifyHTML() {
    return src('src/*.html')
        .pipe(
            htmlmin({
                collapseWhitespace: true,
            })
        )
        .pipe(dest('docs'));
}

function copyAssets() {
    return src('src/assets/*').pipe(dest('docs/assets/'));
}

function minifyCSS() {
    return src('src/*.css').pipe(cleanCSS()).pipe(dest('docs'));
}

function compile() {
    return src('src/js/**/*.js')
        .pipe(
            closureCompiler({
                compilation_level: 'ADVANCED',
                warning_level: 'VERBOSE',
                language_out: 'ECMASCRIPT6',
                js_output_file: 'app.js',
            })
        )
        .pipe(dest('docs'));
}

function compileDev() {
    return src('src/js/**/*.js').pipe(concat('app.js')).pipe(dest('dist'));
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

exports.build = series(
    cleanDist,
    parallel(minifyHTML, minifyCSS, copyAssets, compile)
);
exports.default = series(
    cleanDist,
    parallel(minifyHTML, minifyCSS, copyAssets, compileDev)
);
exports.watch = series(exports.default, startServer, watchSource);
exports.zip = series(exports.build, archive);
