var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var injectPartials = require('gulp-inject-partials');
var replace = require('gulp-replace');
var del = require('del');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var rename = require("gulp-rename");
let cleanCSS = require('gulp-clean-css');



gulp.task('sass', () => {
    var compile =  gulp.src('assets/scss/**/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./assets/css'))
        .pipe(browserSync.stream());
    var minify =  gulp.src('assets/css/**/style.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./assets/css'))
        .pipe(browserSync.stream());
    return merge(compile, minify);
});

gulp.task('serve', gulp.series( 'sass', () => {

    browserSync.init({
        port: 3000,
        server: './',
        notify: false,
        ghostMode: true
    });

    gulp.watch('assets/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('assets/js/**/*.js').on('change', browserSync.reload);

}));

gulp.task('injectPartials', () => {
    return gulp.src("./**/*.html", {base: "./"})
        .pipe(injectPartials())
        .pipe(gulp.dest("."));
});

gulp.task('replacePaths', () => {
    var path1 = gulp.src('./*/pages/*/*.html', {base: './'})
        .pipe(replace('="assets/', '="../../../assets/'))
        .pipe(replace('href="demo_1/', 'href="../../../demo_1/'))
        .pipe(replace('href="demo_2/', 'href="../../../demo_2/'))
        .pipe(replace('href="pages/', 'href="../../pages/'))
        .pipe(replace('href="dashboard-one.html', 'href="../../dashboard-one.html'))
        .pipe(gulp.dest('.'));
    var path2 = gulp.src('./*/pages/*.html', {base: './'})
        .pipe(replace('="assets/', '="../../assets/'))
        .pipe(replace('href="demo_1/', 'href="../../demo_1/'))
        .pipe(replace('href="demo_2/', 'href="../../demo_2/'))
        .pipe(replace('href="pages/', 'href="../../pages/'))
        .pipe(replace('href="dashboard-one.html', 'href="../dashboard-one.html'))
        .pipe(gulp.dest('.'));
    var path3 = gulp.src('./*/*.html', {base: './'})
        .pipe(replace('="assets/', '="../assets/'))
        .pipe(replace('href="demo_1/', 'href="../demo_1/'))
        .pipe(replace('href="demo_2/', 'href="../demo_2/'))
        .pipe(gulp.dest('.'));
    return merge(path1, path2, path3);
});

gulp.task('injectCommonAssets', () => {
    return gulp.src([
        './**/*.html'
    ])
    .pipe(inject(gulp.src([
        './assets/vendors/core/core.css',
        './assets/vendors/core/core.js'
    ], {read: false}), {name:'core', relative: true}))
    .pipe(inject(gulp.src([
        './assets/vendors/feather-icons/feather.min.js',
        './assets/js/template.js',
        './assets/fonts/feather-font/css/iconfont.css',
        './assets/vendors/flag-icon-css/css/flag-icon.min.css'
    ], {read: false}), {relative: true}))
    .pipe(gulp.dest('.'));
});

gulp.task('injectCommonJs', () => {
    return gulp.src([
        './index.html'
    ])
});

gulp.task('inject', gulp.series('injectPartials','replacePaths', 'injectCommonAssets'));

gulp.task('cleanVendors', () => {
    return del([
        './assets/vendors/**/*'
    ]);
});

gulp.task('buildCoreCss', () => {
    return gulp.src([
        './node_modules/perfect-scrollbar/css/perfect-scrollbar.css'
    ])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('core.css'))
        .pipe(gulp.dest('./assets/vendors/core'));
});

gulp.task('buildCoreJs', () => {
    return gulp.src([
        './node_modules/jquery/dist/jquery.min.js', 
        './node_modules/popper.js/dist/umd/popper.min.js', 
        './node_modules/bootstrap/dist/js/bootstrap.min.js', 
        './node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js',
    ])
    .pipe(concat('core.js'))
    .pipe(gulp.dest('./assets/vendors/core'));
});

gulp.task('copyAddonCss', () => {
    var style1 = gulp.src('./node_modules/prismjs/themes/*').pipe(gulp.dest('./assets/vendors/prismjs/themes'));
    var style2 = gulp.src(['./node_modules/morris.js/morris.css']).pipe(cleanCSS({compatibility: 'ie8'})).pipe(gulp.dest('./assets/vendors/morris.js'));
    var style3 = gulp.src(['./node_modules/fullcalendar/dist/fullcalendar.min.css']).pipe(gulp.dest('./assets/vendors/fullcalendar'));
    var style4 = gulp.src(['./node_modules/select2/dist/css/select2.min.css']).pipe(gulp.dest('./assets/vendors/select2'));
    var style5 = gulp.src(['./node_modules/dropzone/dist/min/dropzone.min.css']).pipe(gulp.dest('./assets/vendors/dropzone'));
    var style6 = gulp.src(['./node_modules/dropify/dist/css/dropify.min.css']).pipe(gulp.dest('./assets/vendors/dropify/dist'));
    var style7 = gulp.src(['./node_modules/dropify/dist/fonts/*']).pipe(gulp.dest('./assets/vendors/dropify/fonts'));
    var style8 = gulp.src(['./node_modules/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css']).pipe(gulp.dest('./assets/vendors/bootstrap-colorpicker'));
    var style9 = gulp.src(['./node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css']).pipe(gulp.dest('./assets/vendors/bootstrap-datepicker'));
    var style10 = gulp.src(['./node_modules/tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css']).pipe(gulp.dest('./assets/vendors/tempusdominus-bootstrap-4'));
    var style11 = gulp.src(['./node_modules/font-awesome/css/font-awesome.min.css']).pipe(gulp.dest('./assets/vendors/font-awesome/css'));
    var style12 = gulp.src(['./node_modules/font-awesome/fonts/*']).pipe(gulp.dest('./assets/vendors/font-awesome/fonts'));
    var style13 = gulp.src(['./node_modules/jquery-steps/demo/css/jquery.steps.css']).pipe(cleanCSS({compatibility: 'ie8'})).pipe(gulp.dest('./assets/vendors/jquery-steps'));
    var style14 = gulp.src(['./node_modules/simplemde/dist/simplemde.min.css']).pipe(gulp.dest('./assets/vendors/simplemde'));
    var style15 = gulp.src(['./node_modules/ace-builds/src-min/**/*']).pipe(gulp.dest('./assets/vendors/ace-builds/src-min'));
    var style16 = gulp.src(['./node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css']).pipe(cleanCSS({compatibility: 'ie8'})).pipe(gulp.dest('./assets/vendors/datatables.net-bs4'));
    var style17 = gulp.src(['./node_modules/flag-icon-css/css/flag-icon.min.css']).pipe(gulp.dest('./assets/vendors/flag-icon-css/css'));
    var style18 = gulp.src(['./node_modules/flag-icon-css/flags/**/*']).pipe(gulp.dest('./assets/vendors/flag-icon-css/flags'));
    var style19 = gulp.src(['./node_modules/@mdi/font/css/materialdesignicons.min.css']).pipe(gulp.dest('./assets/vendors/mdi/css'));
    var style20 = gulp.src(['./node_modules/@mdi/font/fonts/*']).pipe(gulp.dest('./assets/vendors/mdi/fonts'));
    var style21 = gulp.src(['./node_modules/cropperjs/dist/cropper.min.css']).pipe(gulp.dest('./assets/vendors/cropperjs'));
    var style22 = gulp.src(['./node_modules/sweetalert2/dist/sweetalert2.min.css']).pipe(gulp.dest('./assets/vendors/sweetalert2'));
    var style23 = gulp.src(['./node_modules/owl.carousel/dist/assets/owl.carousel.min.css']).pipe(gulp.dest('./assets/vendors/owl.carousel'));
    var style24 = gulp.src(['./node_modules/owl.carousel/dist/assets/owl.theme.default.min.css']).pipe(gulp.dest('./assets/vendors/owl.carousel'));
    var style25 = gulp.src(['./node_modules/animate.css/animate.min.css']).pipe(gulp.dest('./assets/vendors/animate.css'));
    var style26 = gulp.src(['./node_modules/jqvmap/dist/jqvmap.min.css']).pipe(gulp.dest('./assets/vendors/jqvmap'));
    return merge(style1, style2, style3, style4, style5, style6, style7, style8, style9, style10, style11, style12, style13, style14, style15, style16, style17, style18, style19, style20, style21, style22, style23, style24, style25);
});

gulp.task('copyAddonJs', () => {
    var script1 = gulp.src('./node_modules/feather-icons/dist/*').pipe(gulp.dest('./assets/vendors/feather-icons'));
    var script2 = gulp.src('./node_modules/prismjs/prism.js').pipe(gulp.dest('./assets/vendors/prismjs'));
    var script3 = gulp.src('./node_modules/prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js').pipe(gulp.dest('./assets/vendors/prismjs/plugins'));
    var script3 = gulp.src('./node_modules/prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js').pipe(gulp.dest('./assets/vendors/prismjs/plugins'));
    var script4 = gulp.src('./node_modules/clipboard/dist/clipboard.min.js').pipe(gulp.dest('./assets/vendors/clipboard'));
    var script5 = gulp.src('./node_modules/chart.js/dist/Chart.min.js').pipe(gulp.dest('./assets/vendors/chartjs'));
    var script6 = gulp.src(['./node_modules/jquery.flot/jquery.flot.js']).pipe(gulp.dest('./assets/vendors/jquery.flot'));
    var script7 = gulp.src(['./node_modules/jquery.flot/jquery.flot.resize.js']).pipe(gulp.dest('./assets/vendors/jquery.flot'));
    var script8 = gulp.src(['./node_modules/jquery.flot/jquery.flot.pie.js']).pipe(gulp.dest('./assets/vendors/jquery.flot'));
    var script9 = gulp.src(['./node_modules/jquery.flot/jquery.flot.categories.js']).pipe(gulp.dest('./assets/vendors/jquery.flot'));
    var script10 = gulp.src(['./node_modules/raphael/raphael.min.js']).pipe(gulp.dest('./assets/vendors/raphael'));
    var script11 = gulp.src(['./node_modules/morris.js/morris.min.js']).pipe(gulp.dest('./assets/vendors/morris.js'));
    var script12 = gulp.src(['./node_modules/peity/jquery.peity.min.js']).pipe(gulp.dest('./assets/vendors/peity'));
    var script13 = gulp.src(['./node_modules/apexcharts/dist/apexcharts.min.js']).pipe(gulp.dest('./assets/vendors/apexcharts'));
    var script14 = gulp.src(['./node_modules/jquery-sparkline/jquery.sparkline.min.js']).pipe(gulp.dest('./assets/vendors/jquery-sparkline'));
    var script15 = gulp.src(['./node_modules/fullcalendar/dist/fullcalendar.min.js']).pipe(gulp.dest('./assets/vendors/fullcalendar'));
    var script16 = gulp.src(['./node_modules/moment/min/moment.min.js']).pipe(gulp.dest('./assets/vendors/moment'));
    var script17 = gulp.src(['./node_modules/jquery-ui-dist/jquery-ui.min.js']).pipe(gulp.dest('./assets/vendors/jquery-ui'));
    var script18 = gulp.src(['./node_modules/inputmask/dist/jquery.inputmask.min.js']).pipe(gulp.dest('./assets/vendors/inputmask'));
    var script19 = gulp.src(['./node_modules/select2/dist/js/select2.min.js']).pipe(gulp.dest('./assets/vendors/select2'));
    var script20 = gulp.src(['./node_modules/typeahead.js/dist/typeahead.bundle.min.js']).pipe(gulp.dest('./assets/vendors/typeahead.js'));
    var script21 = gulp.src(['./node_modules/jquery-tags-input/dist/*']).pipe(gulp.dest('./assets/vendors/jquery-tags-input'));
    var script22 = gulp.src(['./node_modules/dropzone/dist/min/dropzone.min.js']).pipe(gulp.dest('./assets/vendors/dropzone'));
    var script23 = gulp.src(['./node_modules/dropify/dist/js/dropify.min.js']).pipe(gulp.dest('./assets/vendors/dropify/dist'));
    var script24 = gulp.src(['./node_modules/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js']).pipe(gulp.dest('./assets/vendors/bootstrap-colorpicker'));
    var script25 = gulp.src(['./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js']).pipe(gulp.dest('./assets/vendors/bootstrap-datepicker'));
    var script26 = gulp.src(['./node_modules/tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.js']).pipe(gulp.dest('./assets/vendors/tempusdominus-bootstrap-4'));
    var script27 = gulp.src(['./node_modules/bootstrap-maxlength/dist/bootstrap-maxlength.min.js']).pipe(gulp.dest('./assets/vendors/bootstrap-maxlength'));
    var script28 = gulp.src(['./node_modules/jquery-validation/dist/jquery.validate.min.js']).pipe(gulp.dest('./assets/vendors/jquery-validation'));
    var script29 = gulp.src(['./node_modules/jquery-steps/build/jquery.steps.min.js']).pipe(gulp.dest('./assets/vendors/jquery-steps'));
    var script30 = gulp.src(['./node_modules/tinymce/**/*']).pipe(gulp.dest('./assets/vendors/tinymce'));
    var script31 = gulp.src(['./node_modules/simplemde/dist/simplemde.min.js']).pipe(gulp.dest('./assets/vendors/simplemde'));
    var script32 = gulp.src(['./node_modules/datatables.net/js/jquery.dataTables.js']).pipe(gulp.dest('./assets/vendors/datatables.net'));
    var script33 = gulp.src(['./node_modules/datatables.net-bs4/js/dataTables.bootstrap4.js']).pipe(gulp.dest('./assets/vendors/datatables.net-bs4'));
    var script34 = gulp.src(['./node_modules/cropperjs/dist/cropper.min.js']).pipe(gulp.dest('./assets/vendors/cropperjs'));
    var script35 = gulp.src(['./node_modules/sweetalert2/dist/sweetalert2.min.js']).pipe(gulp.dest('./assets/vendors/sweetalert2'));
    var script36 = gulp.src(['./node_modules/promise-polyfill/dist/polyfill.min.js']).pipe(gulp.dest('./assets/vendors/promise-polyfill'));
    var script37 = gulp.src(['./node_modules/owl.carousel/dist/owl.carousel.min.js']).pipe(gulp.dest('./assets/vendors/owl.carousel'));
    var script38 = gulp.src(['./node_modules/jquery-mousewheel/jquery.mousewheel.js']).pipe(gulp.dest('./assets/vendors/jquery-mousewheel'));
    var script39 = gulp.src(['./node_modules/flot.curvedlines/curvedLines.js']).pipe(gulp.dest('./assets/vendors/flot.curvedlines'));
    var script40 = gulp.src(['./node_modules/jquery.flot.tooltip/js/jquery.flot.tooltip.min.js']).pipe(gulp.dest('./assets/vendors/jquery.flot.tooltip'));
    var script41 = gulp.src(['./node_modules/jqvmap/dist/jquery.vmap.min.js']).pipe(gulp.dest('./assets/vendors/jqvmap'));
    var script42 = gulp.src(['./node_modules/jqvmap/dist/maps/jquery.vmap.usa.js']).pipe(gulp.dest('./assets/vendors/jqvmap'));
    var script43 = gulp.src(['./node_modules/jqvmap/dist/maps/jquery.vmap.world.js']).pipe(gulp.dest('./assets/vendors/jqvmap'));
    var script44 = gulp.src(['./node_modules/progressbar.js/dist/progressbar.min.js']).pipe(gulp.dest('./assets/vendors/progressbar.js'));
    return merge(script1, script2, script3, script4, script5, script6, script7, script8, script9, script10, script11, script12, script13, script14, script15, script16, script17, script18, script19, script20, script21, script22, script23, script24, script25, script26, script27, script28, script29, script30, script31, script32, script33, script34, script35, script36, script37, script38, script39, script40, script41, script42, script43);
});


gulp.task('copyVendors', gulp.series('cleanVendors', 'buildCoreCss', 'buildCoreJs', 'copyAddonCss', 'copyAddonJs'));

gulp.task('default', gulp.series('serve'));