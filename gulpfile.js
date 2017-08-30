const gulp = require('gulp')
const path = require('path')
const fs = require('fs')
const clean = require('gulp-clean')
const webpack = require('webpack')
const crx = require('gulp-crx-pack')
const zip = require('gulp-zip')

gulp.task('clean', () => {
  gulp.src(['pack/js/', 'dist']).pipe(clean())
})

gulp.task('build', ['clean'], done => {
  webpack(require(path.resolve('webpack.config.js'))).run((err, stats) => {
    if (err) console.error(err)
    if (done) done()
  })
})

gulp.task('crx', ['build'], () => {
  gulp.src(path.resolve('pack'))
    .pipe(crx({
      privateKey: fs.readFileSync(path.resolve('key.pem'), 'utf8'),
      filename: 'bcy-helper.crx'
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('zip', ['build'], () => {
  gulp.src(path.resolve('pack/**'))
    .pipe(zip('bcy-helper.zip'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['build'])
