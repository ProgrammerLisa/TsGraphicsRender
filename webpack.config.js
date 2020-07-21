const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取css到单独文件的插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 压缩js文件
const HtmlWebpackPlugin = require('html-webpack-plugin') // 把打包后的文件直接注入到html模板中
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 每次运行前清理目录的插件

let targetUrl = ''
let plugins = []
let optimization = {}

switch (process.env.NODE_ENV) {
  case 'development':
    targetUrl = 'https://www.test.bizvane.cn'
    break
  case 'none':
    targetUrl = 'https://www.uat.bizvane.cn'
    break
  case 'production':
    targetUrl = 'https://crm.bizvane.com'
    plugins = [
      new MiniCssExtractPlugin({
        filename: '[name][hash].css', // 都提到build目录下的css目录中
        chunkFilename: '[id][hash].css'
      })
    ]
    optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }), // 压缩js的插件
        new OptimizeCSSAssetsPlugin({}) // 压缩css的插件
      ]
    }
    break
}

module.exports = {
  entry: './src/main.ts', // 入口文件 名字任取 注意路径是否正确

  output: {
    filename: 'bundle.js' // 自动会生成dist目录，因此可以去掉dist/目录
  },

  mode: process.env.NODE_ENV, // 设置为开发者模式

  devtool: 'inline-source-map', // 如果要调试ts源码，需设置成这样

  resolve: {
    extensions: ['.ts', '.js'] // 添加ts和js作为可解析的扩展
  },

  plugins: [
    // 再此可以添加各种插件
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV)
    }),
    new CleanWebpackPlugin(),
    ...plugins
  ],

  ...optimization,

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

    open: true, // 启动服务器时，自动打开浏览器，默认为false

    publicPath: '/dist',

    proxy: [
      {
        context: ['/serviceCard', '/centerstage', '/coupon', '/mktcenter', '/members', '/message', '/fitment', '/analyze', '/wechatEnterprise', '/api', '/behavior', '/customized'],
        target: targetUrl,
        changeOrigin: true
      }
    ]
  }
}

console.log(process.env.NODE_ENV)
console.log(targetUrl)
