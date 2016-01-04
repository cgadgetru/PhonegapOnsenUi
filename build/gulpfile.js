var gulp = require('gulp');
var changed = require('gulp-changed');
var coffee = require('gulp-coffee');
var resolveDependencies = require('gulp-resolve-dependencies');
var coffeeLint = require('gulp-coffeelint');
var rm = require('gulp-rm');
var concat = require('gulp-concat');
var myth = require('gulp-myth');
var csso = require('gulp-csso');
var htmlreplace = require('gulp-html-replace');
var imageMin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


var version = (function(){
    return (Math.random()*10000).toFixed(0)
})();

var client = {
    temp: './temp/',
    vendors: '../client/vendors/',
    css:'../client/css/**/**/**.*',
    styles: ['../client/scss/main.scss'],
    stylesWatch: ['../client/scss/**/*.scss'],
    scriptsCoffee: ['../client/coffee/**/*.coffee'],
    scriptsVendors: [
        '../client/vendors/angular.js',
        '../client/vendors/onsenui.js'
    ],
    images: ['../client/img/**/*'],
    fonts: ['../client/fonts/*'],
    res: ['../client/res/**/**/**.*'],
    indexHtml:['../client/index.html']
};
var phonegap = {
    styles: '../phonegap/www/css/',
    scripts: '../phonegap/www/js/',
    images: '../phonegap/www/img/',
    fonts: '../phonegap/www/fonts/',
    res: '../phonegap/www/res/'
};
gulp.task('rpl',function(){
    gulp.src('../client/index.html')
        .pipe(htmlreplace({
            'js': ['js/vendors.'+version+'.js',
                   'js/main.'+version+'.js'],
            'css':['css/main.'+version+'.css']
        }))
        .pipe(gulp.dest('../phonegap/www/'));

});
gulp.task('lint', function () {
    coffeeLintParams = {
        indentation: {
            "value": 4,
            "level": "error"
        }
    };

    gulp.src(paths.scriptsCoffee)
        .pipe(coffeeLint(coffeeLintParams))
        .pipe(coffeeLint.reporter());
});

gulp.task('scripts', function () {
    gulp.src(phonegap.scripts+'/**.*', { read: false })
        .pipe(rm());

    gulp.src(client.scriptsCoffee)
        .pipe(changed(client.vendors))
        .pipe(resolveDependencies({
            pattern: /#= require [\s-]*(.*?\.coffee)/g
        }))
        .pipe(concat('main.'+version+'.coffee'))
        .pipe(coffee())
        .on('error', console.error)
        .pipe(gulp.dest(phonegap.scripts));

    gulp.src(client.scriptsVendors)
        .pipe(concat('vendors.'+version+'.js'))
        .pipe(gulp.dest(phonegap.scripts))
});

gulp.task('sass', function () {
    gulp.src(phonegap.styles+'/**.*', { read: false })
        .pipe(rm());
    gulp.src(client.css)
        .pipe(gulp.dest(phonegap.styles));
    // gulp.src locates the source files for the process.
    // This globbing function tells gulp to use all files
    // ending with .scss or .sass within the scss folder.
    gulp.src(client.styles)
        // Converts Sass into CSS with Gulp Sass
        .pipe(sass())
        .pipe(csso())
        .pipe(rename('main.'+version+'.css'))
        // Outputs CSS files in the css folder
        .pipe(gulp.dest(phonegap.styles));
});

gulp.task('images', function () {
    gulp.src(client.images)
        .pipe(changed(phonegap.images))
        .pipe(imageMin({optimizationLevel: 5}))
        .pipe(gulp.dest(phonegap.images))
});

gulp.task('fonts', function () {
    gulp.src(client.fonts)
        .pipe(gulp.dest(phonegap.fonts))
});

gulp.task('resources', function () {
    gulp.src(client.res)
        .pipe(gulp.dest(phonegap.res))
});

gulp.task('clear', function () {
//    gulp.src(paths.tempJS[0])
//        .pipe(rm())
});

gulp.task('watch', function () {
    /*gulp.watch(paths.scriptsCoffee, ['scripts','rpl']);
    gulp.watch(paths.scriptsVendors, ['scripts','rpl']);
    gulp.watch(paths.scriptsTemplates, ['scripts','rpl']);*/
    gulp.watch(client.stylesWatch, ['sass','rpl']);
    gulp.watch(client.images, ['images']);
    gulp.watch(client.fonts, ['fonts']);
    gulp.watch(client.indexHtml, ['rpl']);
    gulp.watch(client.res, ['resources']);
});
gulp.task('pbuild',function(){
    gulp.src('../phonegap/zip/**/**/**.*', { read: false })
        .pipe(rm());
    gulp.src(['../phonegap/Clarins/www/**/**.*'])
        .pipe(gulp.dest('../phonegap/zip/'));
    gulp.src(['../phonegap/Clarins/config.xml'])
        .pipe(gulp.dest('../phonegap/zip/'));

});


gulp.task('build', ['scripts', 'styles', 'images', 'fonts','resources','rpl','clear']);

gulp.task('default', [/**/'scripts', 'sass','images', 'fonts','resources', 'rpl', 'watch', /*'clear'*/]);

gulp.task('zip',['pbuild']);

