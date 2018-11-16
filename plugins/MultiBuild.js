let runs = 0;
let scripts = [];
const Plugin = require("./Plugin");

// https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
const safariFix = `!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();`;

module.exports = class MultiBuild extends Plugin {
  register() {
    this.webpackChain.plugin("multi-build").use(MultiBuildHtml);
  }
};

function MultiBuildHtml() {}

MultiBuildHtml.prototype = {
  apply: function(compiler) {
    let tapName = "multi-build";
    compiler.hooks.compilation.tap(tapName, compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        tapName,
        (data, cb) => {
          scripts = scripts.concat(data.assets.js);
          data.plugin.options.scripts = scripts;
          cb(null, data);
        }
      );

      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        tapName,
        async (data, cb) => {
          runs++;

          data.body.forEach(tag => {
            if (tag.tagName === "script" && tag.attributes) {
              if (tag.attributes.src.includes(".modern.js")) {
                return (tag.attributes.type = "module");
              }
              tag.attributes.nomodule = "";
            }
          });
          data.head.forEach(tag => {
            if (
              tag.tagName === "link" &&
              tag.attributes &&
              tag.attributes.as === "script" &&
              tag.attributes.rel === "preload" &&
              tag.attributes.src.includes(".modern.js")
            ) {
              tag.attributes.rel = "modulepreload";
            }
          });

          // inject inline Safari 10 nomodule fix
          data.body.unshift({
            tagName: "script",
            closeTag: true,
            innerHTML: safariFix
          });

          if (runs === 2) {
            data.plugin.options.inject = true;
          } else {
            data.plugin.options.inject = false;
          }
          cb();
        }
      );

      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(
        tapName,
        data => {
          data.html = data.html.replace(/\snomodule="">/g, " nomodule>");
        }
      );
    });
  }
};
