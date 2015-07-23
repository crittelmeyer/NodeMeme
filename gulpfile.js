var gulp = require('gulp'),
    server = require('gulp-express');


gulp.task('default', function() {
  console.log('ran default task!');
});

gulp.task('server', function () {
  
  // Start the server at the beginning of the task
  server.run(['src/server/app.js']);

  // Put watch code here

});
