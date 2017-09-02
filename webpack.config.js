'use strict'

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const getEntries = () => {
  const dirEntries = (itemPath, files) => {
    if (fs.statSync(itemPath).isDirectory()) {
      fs.readdirSync(itemPath).forEach(item => {
        dirEntries(path.resolve(itemPath, item), files)
      })
    } else {
      const matchs = itemPath.match(/(.+)\.ts$/)
      if (!!matchs) files[path.basename(itemPath, '.ts')] = itemPath
    }
  }

  const srcPath = path.resolve(process.cwd(), 'src')
  const dirs = fs.readdirSync(srcPath)
  const files = {}

  dirs.forEach(item => {
    dirEntries(path.resolve(srcPath, item), files)
  })

  return files
}

module.exports = {
  entry: getEntries(),
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
    extensions: ['.ts', '.js'],
    modules: ['node_modules']
  },
  plugins: [
    new webpack.IgnorePlugin(/\.git$/),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
}
