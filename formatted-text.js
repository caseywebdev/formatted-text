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

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

  var _React = _interopRequireDefault(_react);

  var PARAGRAPH_SPLIT = /\n{2,}/;

  var LINE_SPLIT = /\n/;

  var LINK = /(?:\S+)(\w+:\/\/)\S*|([^\s.]+)(\.[a-z-]{2,63})+\S*/gi;

  var DEFAULT_PROTOCOL = 'http://';

  var TERMINATORS = '.,;:?!';

  var WRAPPERS = {
    '(': ')',
    '[': ']',
    '"': '"',
    "'": "'",
    '<': '>'
  };

  var unwrap = function unwrap(_x, _x2) {
    var _again = true;

    _function: while (_again) {
      var text = _x,
          index = _x2;
      first = last = undefined;
      _again = false;
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
      var _match = match;

      var _match2 = _slicedToArray(_match, 4);

      var all = _match2[0];
      var protocol = _match2[1];
      var preTld = _match2[2];
      var tld = _match2[3];

      // To qualify as a link, either the protocol or TLD must be specified.
      if (!protocol && !tld) continue;

      var _match3 = match;
      var index = _match3.index;

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

  var KeyProxy = function KeyProxy(_ref) {
    var children = _ref.children;
    return children;
  };

  var renderLinks = function renderLinks(text, key, props) {
    var links = getLinks(text);
    if (!links.length) return text;
    var length = links.length;

    return links.reduce(function (parts, link, i) {
      var from = link.index;
      var to = from + link.text.length;
      return {
        index: to,
        components: parts.components.concat(text.slice(parts.index, from), _React['default'].createElement(
          KeyProxy,
          { key: key + '-' + i },
          props.linkRenderer(link)
        ), i === length - 1 ? text.slice(to) : null)
      };
    }, { index: 0, components: [] }).components;
  };

  var renderParagraph = function renderParagraph(text, props) {
    var lines = text.trim().split(LINE_SPLIT);
    return lines.reduce(function (paragraph, line, i) {
      return paragraph.concat(renderLinks(line, i, props), i === lines.length - 1 ? null : _React['default'].createElement('br', { key: i }));
    }, []);
  };

  var renderParagraphs = function renderParagraphs(props) {
    var children = props.children;

    if (typeof children !== 'string') children = '';
    var paragraphs = children.trim().split(PARAGRAPH_SPLIT);
    return paragraphs.map(function (paragraph, i) {
      return paragraph ? _React['default'].createElement(
        'p',
        { key: i },
        renderParagraph(paragraph, props)
      ) : null;
    });
  };

  var FormattedText = function FormattedText(_ref2) {
    var children = _ref2.children;
    var linkRenderer = _ref2.linkRenderer;

    var divProps = _objectWithoutProperties(_ref2, ['children', 'linkRenderer']);

    return _React['default'].createElement(
      'div',
      divProps,
      renderParagraphs({ children: children, linkRenderer: linkRenderer })
    );
  };

  FormattedText.propTypes = {
    children: _react.PropTypes.string.isRequired,
    linkRenderer: _react.PropTypes.func.isRequired
  };

  FormattedText.defaultProps = {
    children: '',
    linkRenderer: function linkRenderer(_ref3) {
      var url = _ref3.url;
      var text = _ref3.text;
      return _React['default'].createElement(
        'a',
        { href: url },
        text
      );
    }
  };

  module.exports = FormattedText;
});
