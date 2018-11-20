// Export from "./my-custom-loader.js" or whatever you want.
module.exports = require("babel-loader").custom(babel => {
  return () => {
  	console.info('here')
    return {

    };
  }
});