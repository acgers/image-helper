'use strict'

const gulp = require('gulp')
const path = require('path')
const fs = require('fs')
const es = require('event-stream')
const tsfmt = require('typescript-formatter')
const tslint = require('tslint')
const gTslint = require('gulp-tslint')
const clean = require('gulp-clean')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const crx = require('gulp-crx-pack')
const zip = require('gulp-zip')

let webpackConfig = require(path.resolve('webpack.config'))

gulp.task('clean', () => gulp.src(['pack/js/', 'dist']).pipe(clean()))

gulp.task('lint', () => gulp.src(['src/**/*.ts'])
  .pipe(gTslint({
    fix: true,
    tslint,
    formatter: 'verbose',
    program: tslint.Linter.createProgram(path.resolve('tsconfig.json')),
    configuration: path.resolve('tslint.json')
  }))
  .pipe(gTslint.report({
    summarizeFailureOutput: true,
    allowWarnings: false,
    reportLimit: 5
  }))
)

gulp.task('fmt', () => {
  const formatting = es.map((file, cb) => {
    tsfmt.processString(file.path, file.contents.toString('utf8'), {
      replace: true,
      // verbose: true,
      tsfmt: true,
      tsfmtFile: path.resolve('tsfmt.json')
    }).then((result) => {
      if (result.error) console.error(result.message)
      cb(null, file)
    }, cb)
  })
  gulp.src(['src/**/*.ts'], { base: '.' }).pipe(formatting)
})

gulp.task('build:dev', ['clean', 'fmt', 'lint'], done => {
  webpackConfig = webpackMerge(webpackConfig, {
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        sourceMap: true,
        minChunks: Infinity
      })
    ]
  })
  webpack(webpackConfig).run((err, stats) => {
    if (err) console.error(err)
    if (done) done()
  })
})

gulp.task('build', ['clean', 'fmt', 'lint'], done => {
  webpackConfig = webpackMerge(webpackConfig, {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        comments: false
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        sourceMap: false,
        minChunks: Infinity
      })
    ]
  })
  webpack(webpackConfig).run((err, stats) => {
    if (err) console.error(err)
    if (done) done()
  })
})

gulp.task('crx', ['build'], () => gulp.src(path.resolve('pack'))
  .pipe(crx({
    privateKey: fs.readFileSync(path.resolve('key.pem'), 'utf8'),
    filename: 'image-helper.crx'
  }))
  .pipe(gulp.dest('./dist'))
)

gulp.task('zip', ['build'], () => gulp.src(path.resolve('pack/**'))
  .pipe(zip('image-helper.zip'))
  .pipe(gulp.dest('./dist'))
)

gulp.task('default', ['build'])
