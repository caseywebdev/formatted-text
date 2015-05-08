(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'react'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React);
    global.formattedText = mod.exports;
  }
})(this, function (exports, module, _react) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _React = _interopRequire(_react);

  var PARAGRAPH_SPLIT = /\n{2,}/;

  var LINE_SPLIT = /\n/;

  var LINK = /(?:\S+)(\w+:\/\/)\S*|(\S+)(\.[a-z-]{2,63})+\S*/gi;

  var DEFAULT_PROTOCOL = 'http://';

  var TERMINATORS = '.,;:?!';

  var WRAPPERS = {
    '(': ')',
    '[': ']',
    '"': '"',
    '\'': '\'',
    '<': '>'
  };

  var unwrap = function unwrap(_x, _x2) {
    var _again = true;

    _function: while (_again) {
      first = last = undefined;
      _again = false;
      var text = _x,
          index = _x2;
      var first = text[0];
      var last = text[text.length - 1];

      if (TERMINATORS.indexOf(last) > -1) {
        _x = text.slice(0, -1);
        _x2 = index;
        _again = true;
        continue _function;
      }
      if (WRAPPERS[first] === last) {
        _x = text.slice(1, -1);
        _x2 = index + 1;
        _again = true;
        continue _function;
      }
      return [text, index];
    }
  };

  var getLinks = function getLinks(text) {
    var links = [];
    var match = undefined;
    while (match = LINK.exec(text)) {
      var _match = _slicedToArray(match, 4);

      var all = _match[0];
      var protocol = _match[1];
      var preTld = _match[2];
      var tld = _match[3];

      // To qualify as a link, either the protocol or TLD must be specified.
      if (!protocol && !tld) continue;

      var index = match.index;

      var _unwrap = unwrap(all, index);

      var _unwrap2 = _slicedToArray(_unwrap, 2);

      all = _unwrap2[0];
      index = _unwrap2[1];

      links.push({
        index: index,
        text: all,
        url: protocol ? all : preTld.indexOf('@') !== -1 ? 'mailto:' + all : DEFAULT_PROTOCOL + all
      });
    }
    return links;
  };

  var renderText = function renderText(text, key) {
    if (text) return _React.createElement(
      'span',
      { key: key },
      text
    );
  };

  var renderLink = function renderLink(link, key) {
    return _React.createElement(
      'a',
      { key: key, href: link.url },
      link.text
    );
  };

  var renderLinks = function renderLinks(text, key) {
    var links = getLinks(text);
    if (!links.length) return text;
    var length = links.length;

    return links.reduce(function (parts, link, i) {
      var from = link.index;
      var to = from + link.text.length;
      return {
        index: to,
        components: parts.components.concat(renderText(text.slice(parts.index, from), '' + key + '-' + i * 2), renderLink(link, '' + key + '-' + (i * 2 + 1)), i === length - 1 ? renderText(text.slice(to), '' + key + '-' + length * 2) : null)
      };
    }, { index: 0, components: [] }).components;
  };

  var renderParagraph = function renderParagraph(text) {
    var lines = text.trim().split(LINE_SPLIT);
    return lines.reduce(function (paragraph, line, i) {
      return paragraph.concat(renderLinks(line, i * 2), i === lines.length - 1 ? null : _React.createElement('br', { key: i * 2 + 1 }));
    }, []);
  };

  var renderParagraphs = function renderParagraphs(text) {
    var paragraphs = text.trim().split(PARAGRAPH_SPLIT);
    return paragraphs.map(function (paragraph, i) {
      return paragraph ? _React.createElement(
        'p',
        { key: i },
        renderParagraph(paragraph)
      ) : null;
    });
  };

  var FormattedText = (function (_React$Component) {
    function FormattedText() {
      _classCallCheck(this, FormattedText);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    _inherits(FormattedText, _React$Component);

    _createClass(FormattedText, [{
      key: 'render',
      value: function render() {
        var children = this.props.children;

        var text = typeof children === 'string' ? children : '';
        return _React.createElement(
          'div',
          this.props,
          renderParagraphs(text)
        );
      }
    }], [{
      key: 'propTypes',
      value: {
        children: _React.PropTypes.string
      },
      enumerable: true
    }]);

    return FormattedText;
  })(_React.Component);

  module.exports = FormattedText;
});
