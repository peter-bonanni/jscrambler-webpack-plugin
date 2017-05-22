'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var client = require('jscrambler').default;

var JscramblerPlugin = function () {
  function JscramblerPlugin(_options) {
    _classCallCheck(this, JscramblerPlugin);

    var options = _options;
    if (typeof options !== 'object' || Array.isArray(options)) options = {};
    this.options = options;

    this.processResult = this.processResult.bind(this);
  }

  _createClass(JscramblerPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      var enable = this.options.enable !== undefined ? this.options.enable : true;

      if (!enable) {
        return;
      }

      compiler.plugin('emit', function (compilation, callback) {
        var sources = [];
        compilation.chunks.forEach(function (chunk) {
          if (Array.isArray(_this.options.chunks) && !_this.options.chunks.includes(chunk.name)) {
            return;
          }

          chunk.files.forEach(function (filename) {
            if (/\.(jsx?|map|html|htm)$/.test(filename)) {
              var content = compilation.assets[filename].source();

              sources.push({ content, filename });
            }
          });
        });

        if (sources.length > 0) {
          client.protectAndDownload(Object.assign(_this.options, {
            sources,
            stream: false
          }), function (res) {
            return _this.processResult(res, compilation, callback);
          });
        } else {
          callback();
        }
      });
    }
  }, {
    key: 'processResult',
    value: function processResult(results, compilation, callback) {
      var _loop = function _loop(result) {
        compilation.assets[result.filename] = {
          source() {
            return result.content;
          },
          size() {
            return result.content.length;
          }
        };
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var result = _step.value;

          _loop(result);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      callback();
    }
  }]);

  return JscramblerPlugin;
}();

module.exports = JscramblerPlugin;