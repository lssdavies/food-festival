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

/** The basic configuration, we need to provide webpack with three properties: entry, output, and mode. */
//The main configuration object within our file.
module.exports = {
  entry: "./assets/js/script.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
  },
  plugins: [
    //the original build used jquery and bootstrap scripts so we need to let weback know by adding pluggins to base config
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
  mode: "development",
};
/**The entry point is the root of the bundle and the beginning of the dependency graph, so it uses the relative path to the code. webpack will next take the entry point we have provided, bundle that code, and output that bundled code to a folder that we specify. It is common and best practice to put your bundled code into a folder named dist. Mode is next and instructs webpack which mode to run in. Default for webpack is production mode however, here we will use it in development.*/