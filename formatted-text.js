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

  var renderText = function renderText(text, key) {
    if (text) return _React['default'].createElement(
      'span',
      { key: key },
      text
    );
  };

  var renderLink = function renderLink(link, key) {
    return _React['default'].createElement(
      'a',
      { key: key, target: "_blank", href: link.url },
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
        components: parts.components.concat(renderText(text.slice(parts.index, from), key + '-' + i * 2), renderLink(link, key + '-' + (i * 2 + 1)), i === length - 1 ? renderText(text.slice(to), key + '-' + length * 2) : null)
      };
    }, { index: 0, components: [] }).components;
  };

  var renderParagraph = function renderParagraph(text) {
    var lines = text.trim().split(LINE_SPLIT);
    return lines.reduce(function (paragraph, line, i) {
      return paragraph.concat(renderLinks(line, i * 2), i === lines.length - 1 ? null : _React['default'].createElement('br', { key: i * 2 + 1 }));
    }, []);
  };

  var renderParagraphs = function renderParagraphs(text) {
    if (typeof text !== 'string') text = '';
    var paragraphs = text.trim().split(PARAGRAPH_SPLIT);
    return paragraphs.map(function (paragraph, i) {
      return paragraph ? _React['default'].createElement(
        'p',
        { key: i },
        renderParagraph(paragraph)
      ) : null;
    });
  };

  module.exports = function (props) {
    return _React['default'].createElement(
      'div',
      props,
      renderParagraphs(props.children)
    );
  };
});
