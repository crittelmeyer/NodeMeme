var gulp = require('gulp');
var gls = require('gulp-live-server');

gulp.task('serve', function() {

    //cool, gls gives us options. we can use gls's built-in static file server
    //var server = gls.static('src/client/static'); //equals to gls.static('public', 3000);
    //server.start();

    //or...

    //we can just call any old server we want (express!) and let that handle our static files!
    var server = gls.new('src/server/app.js');
    server.start();


    //or heck, both...? you could have gls serve static and express serve dynamic routes.
    //not sure what, if any, benefit there would be from doing it one way or the other...

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['src/client/static/**/*.css', 'src/client/static/**/*.html'], function () {
        server.notify.apply(server, arguments);
    });
});