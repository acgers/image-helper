const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const getEntry = () => {
  let srcPath = path.resolve(process.cwd(), 'src')
  let dirs = fs.readdirSync(srcPath)
  let files = {}
  dirs.forEach(function (item) {
    let matchs = item.match(/(.+)\.ts$/)
    if (!!matchs) {
      files[matchs[1]] = path.resolve('src', item)
    }
  })
  return files
}

module.exports = {
  // devtool: 'cheap-module-source-map',
  entry: getEntry(),
  output: {
    path: path.join(__dirname, 'pack/js'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        exclude: path.resolve(__dirname, 'node_modules'),
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      sourceMap: false,
      minChunks: Infinity
    }),

    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: false,
    //   comments: false
    // })
  ]
}
