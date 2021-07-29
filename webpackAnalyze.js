process.env.NODE_ENV = 'production';
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const webpackConfigProd = require('ingenium-react-scripts/config/webpack.config')('production');

// webpackConfigProd.plugins.push(
//   new BundleAnalyzerPlugin({
//     analyzerMode: 'static',
//     reportFilename: 'report.html',
//   }),
// );

webpackConfigProd.plugins.push(new BundleAnalyzerPlugin());

webpack(webpackConfigProd, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.log(err);
  }
});
