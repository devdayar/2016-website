'use strict'

const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
const del = require('del')
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const postcss = require('gulp-postcss')
const pump = require('pump')
const rename = require('gulp-rename')
const standard = require('gulp-standard')
const uglify = require('gulp-uglify')

gulp.task('build', ['minify-html', 'build-css', 'build-js', 'copy-assets', 'copy-cname'])

gulp.task('build-css', ['clean-css'], cb => {
  pump([
    gulp.src([
      'src/css/styles.css'
    ]),
    postcss([
      require('postcss-import'),
      require('autoprefixer')({
        browsers: ['last 2 versions']
      }),
      require('cssnano')({
        discardComments: {
          removeAll: true
        },
        safe: true
      })
    ]),
    rename('main.css'),
    gulp.dest('dist/css'),
    browserSync.stream()
  ], cb)
})

gulp.task('build-js', ['clean-js', 'lint-js'], cb => {
  pump([
    gulp.src([
      'src/js/app.js'
    ]),
    concat('main.js', {
      newLine: ';'
    }),
    babel({
      presets: ['es2015']
    }),
    uglify(),
    gulp.dest('dist/js'),
    browserSync.stream()
  ], cb)
})

gulp.task('clean-assets', () => del('dist/assets/**/*.*'))

gulp.task('clean-css', () => del('dist/css/*.css'))

gulp.task('clean-js', () => del('dist/js/*.js'))

gulp.task('copy-assets', ['clean-assets'], cb => {
  pump([
    gulp.src([
      'src/assets/**/*.*'
    ]),
    gulp.dest('dist/assets')
  ], cb)
})

gulp.task('copy-cname', cb => {
  pump([
    gulp.src([
      'CNAME'
    ]),
    gulp.dest('dist')
  ], cb)
})

gulp.task('lint-js', cb => {
  pump([
    gulp.src([
      'gulpfile.js',
      'src/js/app.js'
    ]),
    standard(),
    standard.reporter('default', {
      breakOnError: true,
      breakOnWarning: true
    })
  ], cb)
})

gulp.task('minify-html', cb => {
  pump([
    gulp.src('src/*.html'),
    htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }),
    gulp.dest('./dist'),
    browserSync.stream()
  ], cb)
})

gulp.task('default', ['build'], () => {
  browserSync.init({
    open: false,
    port: 6590,
    reloadOnRestart: true,
    server: './dist',
    ui: false
  })

  gulp.watch('src/*.html', ['minify-html'])
  gulp.watch('src/css/*.css', ['build-css'])
  gulp.watch('src/js/*.js', ['build-js'])
})
