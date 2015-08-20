/**
 * @file gulpfile.js
 * @name Gulpfile
 * @author Chris Rittelmeyer <crittelmeyer@floatingtree.com>
 *
 * @desc This is where all of our development tasks are configured and maintained.
 *
 * Tasks such as:
 * - starting the app up
 * - compiling source files
 * - running tests
 * - generating documentation
 * - managing product versioning
 * - and much, much more!
 *
 * We can also set up "watch" tasks to watch for certain types of files to be changed,
 * and then trigger other tasks. For instance, modifying an SCSS file might trigger a watch task that
 * re-compiles the modified code as soon as you save the change, (which in turn triggers a watch task
 * that refreshes [or "live reloads"] the page for you in your browser).
 */

var gulp = require('gulp');
var gls = require('gulp-live-server');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');

var server = gls.new('dist/server/app.js');

/**
 * @name default
 * @desc The default task - build the project and serve it up
 */
gulp.task('default', ['build', 'serve']);

/**
 * @name clean
 * @desc The dist/ cleanup task - Removes all files and folders from the build directory
 */
gulp.task('clean', function() {
    var rm = require('gulp-rimraf');

    //pipe everything from the build directory into the remove function
    return gulp.src('dist/*').pipe(rm());
});

/**
 * @name copy
 * @desc The copy task - some files don't need to be compiled and moved over to dist, they just
 * need to be straight up copied over to dist without any processing.
 */
gulp.task('copy', function() {

    /*
    * Client-side static files
    */
    gulp.src('src/client/index.html')
        .pipe(gulp.dest('dist/client'));

    gulp.src('src/client/**/*.jpg')
        .pipe(gulp.dest('dist/client'));

    /*
     * Server-side static files
     */
    gulp.src('src/server/**/*.*')
        .pipe(gulp.dest('dist/server'));
});

/**
 * @name babel
 * @desc The Babel compilation task - converts all JSX files & ES6 syntax into JS and moves them to dist
 */
gulp.task('babel', function() {
    return gulp.src('src/client/**/*.jsx')
        .pipe(babel())
        .pipe(gulp.dest('dist/client'));
});

/**
* @name scss
* @desc The scss compilation task - converts all SCSS to CSS
*/
gulp.task('scss', function() {
    gulp.src('src/client/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/client'));
});


/**
 * @name compile
 * @desc The overall compilation task - compiles JSX, SCSS, ES6, etc.
 */
//gulp.task('compile', gulp.parallel('babel', 'scss'));
gulp.task('compile', ['babel', 'scss']);

/**
* @name version
* @desc The versioning task - copies the version number and injects into the code at specified locations
*/
gulp.task('version', function() {
    console.log('version');
});

/**
* @name bundle
* @desc The bundling task - uses webpack to minify & compress everything into a neat little bundle
*/
gulp.task('bundle', function() {
    console.log('bundle');
});

/**
 * @name build
 * @desc The build task - clears out the dist folder, compiles everything, versions it, & bundles it
 */
//gulp.task('build', gulp.series('clean', gulp.parallel('copy', 'compile'), 'version', 'bundle'));
gulp.task('build', function() {
    runSequence('clean', ['copy', 'compile'], 'version', 'bundle');
});

/**
 * @name staticwatch
 * @desc Watches static files and copies them to build directory when saved changes are detected.
 */
gulp.task('staticwatch', function() {

    //copy static files when they change
    //gulp.watch('src/client/index.html', gulp.series('copy'));
    gulp.watch('src/client/index.html', ['copy']);
});

/**
 * @name babelwatch
 * @desc Watches JS files and compiles them into build directory when saved changes are detected.
 */
gulp.task('babelwatch', function() {

    //compile all JSX when any JSX files change
    //gulp.watch('src/client/**/*.jsx', gulp.series('jsx'));
    gulp.watch('src/client/**/*.jsx', ['babel']);

    //compile all JS (potentially ES6 syntax) when any JS files change
    //gulp.watch('src/client/**/*.jsx', gulp.series('jsx'));
    //todo: test if this even works... also, maybe we can condense these two watches into one line:
    //gulp.watch('src/client/**/*.js*', ['babel']);     ?
    gulp.watch('src/client/**/*.js', ['babel']);

    // Watch server files as well
    gulp.watch('src/server/**/*.js', ['babel']);

});

/**
* @name scsswatch
* @desc Watches SCSS files and compiles them into build directory when saved changes are detected.
*/
gulp.task('scsswatch', function() {

    //compile all SCSS when any SCSS files change
    //gulp.watch('src/client/**/*.scss', gulp.series('scss'));
    gulp.watch('src/client/**/*.scss', ['scss']);
});

/**
 * @name watch
 * @desc The watch task - watches for changes to source files and triggers appropriate compile tasks.
 */
gulp.task('watch', ['staticwatch', 'babelwatch', 'scsswatch']);

/**
 * @name livereload
 * @desc Reloads the page in browser when a saved change is detected.
 */
gulp.task('livereload', function() {
    server.notify.apply(server, arguments);
});

/**
 * @name serve
 * @desc The app serve task - starts the server for the app
 * Also live reloads the page in the browser after source files are compiled.
 */
gulp.task('serve', function() {

    //cool, gls gives us options. we can use gls's built-in static file server
    //var server = gls.static('src/client/static'); //equals to gls.static('public', 3000);
    //server.start();

    //or...

    //we can just call any old server we want (express!) and let that handle our static files!
    server.start();

    //or heck, both...? you could have gls serve static and express serve dynamic routes.
    //not sure what, if any, benefit there would be from doing it one way or the other...

    //enable live reloading by watching for trigger filetypes (html, css, js, etc) and notifying the server
    gulp.watch(['dist/client/**/*.html', 'dist/client/**/*.css', 'dist/client/**/*.js', 'dist/server/**/*.js'], ['livereload']);

});

/**
 * @name develop
 * @desc The develop task - serve the app and watch for file updates
 */
//gulp.task('develop', gulp.parallel('serve', 'watch'));
gulp.task('develop', ['serve', 'watch']);

/**
 * @name lint
 * @desc The lint task - Runs eslint and scsslint tasks.
 */
gulp.task('lint', ['eslint']);//, 'scsslint']);

/**
* @name eslint
* @desc The eslint task - Runs eslint using specified rules.
*/
gulp.task('eslint', function() {
    var eslintOptions = {
        configFile: 'config/eslint/.eslintrc',
        rulePaths: ['config/eslint/custom_rules'],
        envs: [
            'browser',
            'node'
        ]
    };

    return gulp.src(['src/**/*.js'])
        .pipe(eslint(eslintOptions))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

///**
// * @name scsslint
// * @desc The scsslint task - Runs scsslint using specified rules.
// */
//gulp.task('scsslint', function() {
//
//});

/**
 * @name lint
 * @desc The lint task - runs both eslint and scsslint tasks
 */
//gulp.task('lint', gulp.parallel('eslint', 'scsslint'));

/**
 * @name test
 * @desc The test task - Runs all jest tests
 */
//gulp.task('test', function() {
//
//});

/**
 * @name doc
 * @desc The doc task - Generates documentation from specified source files.
 * Uses JSDOC syntax parsed from the source files to generate stylized documentation.
 */
//gulp.task('doc', function() {
//
//});

/**
 * @name bump
 * @desc The version bump task - Bumps the version number up
 */
//gulp.task('bump', function() {
//
//});