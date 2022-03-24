/* this file configures webpack think of it as the blueprint for how web pack should behave.To install webpack run the following commands in terminal from the root directory -
 1. create a package.json - npm init --y
 2. npm install -D webpack weback cli //-D installs the packages as devDependency
 3. weback -v or npm run webpack -v //if you get the following error webpack: command not found
 4. touch webpack.config.js // to create this config file and cannot be named anything else
 5. add the following code to webpack.config.js
 6. Add the following to package.json: 
    "scripts": {
    "webpack": "webpack --watch",
    "build": "webpack"
    },
    We pass --watch flag into our command, so webpack will monitor saved changes to our files. i.e. when there is a change webpack will re-bundle the code.
    7. npm run build //to run webpack
 */
//installing path
const path = require("path");
/**Because plugin is built into webpack, we need to be sure we're bringing webpack's methods and properties into the config file.  */
const webpack = require("webpack");
/*importing depedency since we installed below packet i.e. npm install -D webpack-bundle-analyzer, webpack has access to this plugin now so it needs to be added to the plugins property export object*/
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

/** The basic configuration, we need to provide webpack with three properties: entry, output, and mode. */
//The main configuration object within our file.
module.exports = {
  //since we splilt the script.js files and modularized the code we need to add the addional js files as entry points for webpack
  entry: {
    app: "./assets/js/script.js",
    events: "./assets/js/events.js",
    schedule: "./assets/js/schedule.js",
    tickets: "./assets/js/tickets.js",
  },
  //also need to revise the output as a result of split
  output: {
    filename: "[name].bundle.js", //[name] will corrspond to each entry eg app.bundle
    path: __dirname + "/dist",
  },
  plugins: [
    //the original build used jquery and bootstrap scripts so we need to let weback know by adding pluggins to base config
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static", //configured the analyzerMode property with a static value. This report outputs to an HTML file in the dist folder
    }),
  ],
  /*Installed file-loader package i.e. npm install -D file-loader to optimize the apps images so added "test" and "use" to module rules array which uses regex to find all jpeg file and uses file-loader to optimize the files.
  
  Also added an options object below the loader assignment that contains a name function, which returns the name of the file with the file extension. Below that is the publicPath property, which is also a function that changes our assignment URL by replacing the ../ from our require() statement with /assets/.
  */
  module: {
    rules: [
      {
        test: /\.jpg$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name(file) {
                return "[path][name].[ext]";
              },
              publicPath: function (url) {
                return url.replace("../", "/assets/");
              },
            },
          },
          {
            loader: "image-webpack-loader",
          },
          //the first part of converting our image through webpack is complete. The next step will be to use a image optimizer loader, file-loader only emitted our images without reducing the size. We can use a package from npm called image-webpack-loader to do that. Let's install this package in our root directory using the following command: npm install image-webpack-loader once installed at to use array
        ],
      },
    ],
  },
  mode: "development",
};
/**The entry point is the root of the bundle and the beginning of the dependency graph, so it uses the relative path to the code. webpack will next take the entry point we have provided, bundle that code, and output that bundled code to a folder that we specify. It is common and best practice to put your bundled code into a folder named dist. Mode is next and instructs webpack which mode to run in. Default for webpack is production mode however, here we will use it in development.*/
