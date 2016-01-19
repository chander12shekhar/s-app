/*=====================================
=        Default Configuration        =
=====================================*/

// Please use config.js to override these selectively:

var config = {
  dest: 'www',
  cordova: true,
  minify_images: true,
  vendor: {
    js: [
        './bower_components/angular/angular.js',
        './bower_components/angular-ui-router/release/angular-ui-router.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/angular-resource/angular-resource.js',
        './bower_components/angular-cookies/angular-cookies.min.js',
        './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
        './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.js',
        './bower_components/angular-csrf-cross-domain/dist/angular-csrf-cross-domain.js',
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './bower_components/ngmap/build/scripts/ng-map.js',
        './bower_components/photoswipe/dist/photoswipe.js',
        './bower_components/photoswipe/dist/photoswipe-ui-default.js',
        './bower_components/ngCordova/dist/ng-cordova.js',
        './bower_components/angular-socialshare/angular-socialshare.min.js',
        './bower_components/ngOpenFB/ngOpenFB.js',
        './bower_components/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js',
        './bower_components/lodash/dist/lodash.min.js',
        './bower_components/angular-bootstrap/ui-bootstrap.min.js',
        './bower_components/angular-svg-round-progressbar/build/roundProgress.js',
        './bower_components/ng-cordova-oauth/dist/ng-cordova-oauth.min.js',
        './bower_components/progressbar.js/dist/progressbar.js',
        './bower_components/angular-base64/angular-base64.js'

    ],
    fonts: [
      './bower_components/font-awesome/fonts/fontawesome-webfont.*',
      './bower_components/bootstrap/fonts/*.*'
    ],
    css: [
        './src/less/app.less',
        './src/less/responsive.less',
        './src/less/buttons.css'
    ]
  },

  server: {
    host: '0.0.0.0',
    port: '8000'
  },

  weinre: {
    httpPort:     8001,
    boundHost:    'localhost',
    verbose:      false,
    debug:        false,
    readTimeout:  5,
    deathTimeout: 15
  }
};


if (require('fs').existsSync('./config.js')) {
  var configFn = require('./config');
  configFn(config);
}

/*-----  End of Configuration  ------*/


/*========================================
=            Requiring stuffs            =
========================================*/

var gulp           = require('gulp'),
    seq            = require('run-sequence'),
    connect        = require('gulp-connect'),
    less           = require('gulp-less'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    cssmin         = require('gulp-cssmin'),
    cssImport        = require('gulp-cssimport'),
    order          = require('gulp-order'),
    concat         = require('gulp-concat'),
    ignore         = require('gulp-ignore'),
    rimraf         = require('gulp-rimraf'),
    imagemin       = require('gulp-imagemin'),
    pngcrush       = require('imagemin-pngcrush'),
    templateCache  = require('gulp-angular-templatecache'),
    mobilizer      = require('gulp-mobilizer'),
    ngAnnotate     = require('gulp-ng-annotate'),
    replace        = require('gulp-replace'),
    preprocess = require('gulp-preprocess'),
    stubby = require('gulp-stubby-server'),
    ngrok = require('ngrok'),
    ngFilesort     = require('gulp-angular-filesort'),
    streamqueue    = require('streamqueue'),
    rename         = require('gulp-rename'),
    path           = require('path'),
    gulpNgConfig   = require('gulp-ng-config'),
    shell          = require('gulp-shell'),
    argv           = require('yargs').argv,
    git            = require('gulp-git'),
    replacer       = require('gulp-replace'),
    fs             = require('fs'),
    https = require('https');


/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('error', function(e) {
  throw(e);
});


/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function (cb) {
  return gulp.src([
        path.join(config.dest, 'index.html'),
        path.join(config.dest, 'images'),
        path.join(config.dest, 'css'),
        path.join(config.dest, 'js'),
        path.join(config.dest, 'fonts')
      ], { read: false })
     .pipe(rimraf());
});


/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function() {
  if (typeof config.server === 'object') {
    connect.server({
      root: config.dest,
      host: config.server.host,
      port: config.server.port,
      livereload: true
    });
  } else {
    throw new Error('Connect is not configured');
  }
});


/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('livereload', function () {
  gulp.src(path.join(config.dest, '*.html'))
    .pipe(connect.reload());
});


/*=====================================
=            Minify images            =
=====================================*/

gulp.task('images', function () {
  var stream = gulp.src('src/images/**/*');
// FOR DEVELOPMENT SKIP THIS
//  if (config.minify_images) {
//    stream = stream.pipe(imagemin({
//        progressive: true,
//        svgoPlugins: [{removeViewBox: false}],
//        use: [pngcrush()]
//    }));
//  }

  return stream.pipe(gulp.dest(path.join(config.dest, 'images')));
});


/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function() {
  return gulp.src(config.vendor.fonts)
  .pipe(gulp.dest(path.join(config.dest, 'fonts')));
});


/*=================================================
=            Copy html files to dest              =
=================================================*/

gulp.task('html', function() {
  var inject = [];
  if (typeof config.weinre === 'object') {
    inject.push('<script src="http://'+config.weinre.boundHost+':'+config.weinre.httpPort+'/target/target-script-min.js"></script>');
  }
  if (config.cordova) {
    inject.push('<script src="cordova.js"></script>');
  }
  gulp.src(['src/html/**/*.html'])
  .pipe(replace('<!-- inject:js -->', inject.join('\n    ')))
  .pipe(gulp.dest(config.dest));
});


/*======================================================================
=            Compile, minify, mobilize less                            =
======================================================================*/

gulp.task('less', function () {
    gulp.src(config.vendor.css)
    .pipe(less({
      paths: [ path.resolve(__dirname, 'src/less'), path.resolve(__dirname, 'bower_components') ]
    }))
        .pipe(cssImport({
            paths: [ path.resolve(__dirname, 'bower_components') ]
        }).on('error', function(err) {
            console.log(err);
        }))
    .pipe(mobilizer('app.css', {
      'app.css': {
        hover: 'exclude',
        screens: ['0px']
      },
      'hover.css': {
        hover: 'only',
        screens: ['0px']
      }
    }))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.join(config.dest, 'css')));
});


/*====================================================================
=            Compile and minify js generating source maps            =
====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

gulp.task('js', function() {
    streamqueue({ objectMode: true },
      gulp.src(config.vendor.js),
      gulp.src('./src/js/**/*.js').pipe(ngFilesort()),
      gulp.src('./src/js/**/**/*.js'),
      gulp.src(['src/templates/**/*.html','src/templates/**/**/*.html','src/template/**/*.html']).pipe(templateCache({ module: 'FoodeeBuddee' }))
    )
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(preprocess({context: { SERVER_URL: process.env.SERVER_URL || 'http://localhost:8080'}}))
    .pipe(ngAnnotate())
    //.pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(config.dest, 'js')));
});


/*===================================================================
=            Watch for source changes and rebuild/reload            =
===================================================================*/

gulp.task('watch', function () {
  if (typeof config.server === 'object') {
    gulp.watch([config.dest + '/**/*'], ['livereload']);
  }
  gulp.watch(['./src/html/**/*'], ['html']);
  gulp.watch(['./src/less/**/*'], ['less']);
  gulp.watch(['./src/js/**/*', './src/templates/**/*','./src/template/**/*','./src/js/**/**/*', config.vendor.js], ['js']);
  gulp.watch(['./src/images/**/*'], ['images']);
});


/*===================================================
=            Starts a Weinre Server                 =
===================================================*/

gulp.task('weinre', function() {
  if (typeof config.weinre === 'object') {
    var weinre = require('./node_modules/weinre/lib/weinre');
    weinre.run(config.weinre);
  } else {
    throw new Error('Weinre is not configured');
  }
});

gulp.task('stub-server', function(cb) {
    var options = {
        files: [
            'stubs/requests/*.json'
        ],
        stubs: 9000
    };
    stubby(options, function() {
        ngrok.connect(9000, function (err, url) {
            console.log('Connected to ngrok tunnel', url);
            process.env.SERVER_URL = url;
            cb();
        });
    });
});

/*======================================
=            Build Sequence            =
======================================*/

gulp.task('build', function(done) {
  var tasks = ['html', 'fonts', 'images', 'less', 'js'];
  seq('clean', tasks, done);
});


/*====================================
=            Default Task            =
====================================*/

var serverAndWatchTasks = function() {
  var tasks = [];

  if (typeof config.weinre === 'object') {
    tasks.push('weinre');
  }

  if (typeof config.server === 'object') {
    tasks.push('connect');
  }

  tasks.push('watch');

  return tasks;
};

gulp.task('default', function(done){
    seq('build', serverAndWatchTasks(), done);
});

gulp.task('server-with-stub', function(done) {
    seq('stub-server', 'build', serverAndWatchTasks(), done);
});

gulp.task('devEnv', function(done) {
  var config = JSON.parse(fs.readFileSync('./environment.json'));
  var googleApi = 'key=' + config.test.EnvConfig.settings.googleApiKey + '&libraries';
  gulp.src(['src/html/main.html'])
    .pipe(replace(/key=(.*?)&libraries/g, googleApi))
    .pipe(gulp.dest('src/html/'));
  gulp.src('environment.json')
    .pipe(gulpNgConfig('foodeebuddee.config', { environment: 'dev' }))
    .pipe(gulp.dest('./src/js/'));
  seq('build', serverAndWatchTasks(), done);
});

gulp.task('testEnv', function(done) {
  var config = JSON.parse(fs.readFileSync('./environment.json'));
  var googleApi = 'key=' + config.test.EnvConfig.settings.googleApiKey + '&libraries';
  gulp.src(['src/html/main.html'])
    .pipe(replace(/key=(.*?)&libraries/g, googleApi))
    .pipe(gulp.dest('src/html/'));
  gulp.src('environment.json')
    .pipe(gulpNgConfig('foodeebuddee.config', { environment: 'test' }))
    .pipe(gulp.dest('./src/js/'));
  seq('build', serverAndWatchTasks(), done);
});


gulp.task('prodEnv', function(done) {
  var version = argv.version;
  if(version === undefined || version === null) {
    throw new Error('You must provide a version with --version= (i.e --version=1.1)');
  }
  var config = JSON.parse(fs.readFileSync('./environment.json'));
  gulp.src('environment.json')
    .pipe(gulpNgConfig('foodeebuddee.config', { environment: 'prod' }))
    .pipe(gulp.dest('./src/js/'));
  console.log('Update version');
  gulp.src(['config.xml'])
    .pipe(replace(/version="(.*?)"/g, 'version="' + version + '"'))
    .pipe(gulp.dest('.'));
  console.log('Update google analytics');
  var googleApi = 'key=' + config.prod.EnvConfig.settings.googleApiKey + '&libraries';
  gulp.src(['src/html/main.html'])
    .pipe(replace(/key=(.*?)&libraries/g, googleApi))
    .pipe(gulp.dest('src/html/'));
  seq('build', done);

});


gulp.task('release', function(done) {
  gulp.src('environment.json')
    .pipe(gulpNgConfig('foodeebuddee.config', { environment: 'prod' }))
    .pipe(gulp.dest('./src/js/'));
  seq('build', 'tag', 'buildPackages', 'resetApi', done);
});

gulp.task('tag', function() {
  var version = argv.version;
  var tag = 'v.' + version;
  if(version !== undefined && version !== null) {
    git.tag(tag, 'Release tag ' + tag, function(err) {
      if (err) {
        throw err;
      }
    });
    console.log('Tag ' + tag + ' created!');
    seq('notify-hipchat');
    if(argv.push !== undefined && argv.push === 'yes') {
      git.push('origin', tag, function(err) {
        if(err) {
          throw err;
        }
      });

      console.log('Tag pushed to origin');
    }


  } else {
    throw new Error('You must provide a version with --version= (i.e --version=1.1)');
  }
});

gulp.task('buildPackages', function() {
  if(argv.ios !== undefined && argv.ios === 'yes') {
    console.log('Building for ios');
    gulp.task('buildIos', shell.task('./ios-build.sh'));
    seq('buildIos');
  }

  if(argv.android !== undefined && argv.android === 'yes') {
    console.log('Building for android');
    gulp.task('buildAndroid', shell.task('cordova build android --release'));
    seq('buildAndroid');
  }
  seq('cleanGit');
});

gulp.task('buildArtifacts', function() {
  var env = argv.env;
  if(env !== undefined && env !== null) {
    gulp.src('environment.json')
      .pipe(gulpNgConfig('foodeebuddee.config', { environment: env }))
      .pipe(gulp.dest('./src/js/'));
    seq('buildPackages');
  }

});

gulp.task('cleanGit', function() {
  git.clean({ args: '-f' }, function (err) {
    if(err) {
      throw err;
    }
  });
});

gulp.task('resetApi', function() {
  console.log("Resetting api to dev");
  gulp.src('environment.json')
    .pipe(gulpNgConfig('foodeebuddee.config', { environment: 'dev' }))
    .pipe(gulp.dest('./src/js/'));
});


gulp.task('notify-hipchat', function (done) {
  var version = argv.version;
  var post_data = JSON.stringify({
    'message' : 'Tag ' + version + ' created!'
  });

  var options = {
    hostname : 'api.hipchat.com',
    port: 443,
    path : '/v2/room/2341596/notification?auth_token=0cQj9yx4zpCEdWFrOSsUVVYbvtBKzYgpcQVDbMnx',
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var stream = https.request(options, function(done) { console.log('HipChat notified'); });
  stream.write(post_data);
  stream.end();

});

