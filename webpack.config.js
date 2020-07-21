const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
console.log('process.env.NODE_ENV=' + process.env.NODE_ENV)
console.log('process.env.BASE_API=' + process.env.BASE_API)
console.log(process.env.npm_lifecycle_event)
module.exports = {
  entry: './src/main.ts', // 入口文件 名字任取 注意路径是否正确

  output: {
    filename: './bundle.js' // 自动会生成dist目录，因此可以去掉dist/目录
  },

  mode: process.env.NODE_ENV, // 设置为开发者模式

  devtool: 'inline-source-map', // 如果要调试ts源码，需设置成这样

  resolve: {
    extensions: ['.ts', '.js'] // 添加ts和js作为可解析的扩展
  },

  plugins: [
    // 再此可以添加各种插件
    new webpack.HotModuleReplacementPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.ts&/, // 正则表达式---如果是.ts结尾的文件
        use: ['ts-loader'] // 则使用ts-loader来加载ts源码并自动进行转译
      },
      {
        test: /\.(css|less)/,
        use: [
          process.env.NODE_ENV === 'development' ? { loader: 'style-loader' }: MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }
        ]
      }
    ]
  },

  // 配置webpack-dev-server服务器
  devServer: {
    contentBase: path.join(__dirname, './'), // 设置url的个目录，如果不设置，则默认指向项目根目录(和设置./效果一样)

    compress: true, // 如果为true, 开启虚拟服务器时为代码进行压缩，起到加快开发流程和优化的作用

    host: 'localhost', //设置主机名，默认为'localhost'

    port: 7777, // 设置端口号，默认端口号为8080

    hot: true, // 热更新

    historyApiFallback: true, // 让所有404错误的页面定位到index.html

    open: true // 启动服务器时，自动打开浏览器，默认为false
  }
}
