(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.React);
    global.FormattedText = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _react) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = void 0;
  _react = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

  var unwrap = function unwrap(text, index) {
    var _ref = [text[0], text[text.length - 1]],
        first = _ref[0],
        last = _ref[1];
    if (TERMINATORS.indexOf(last) > -1) return unwrap(text.slice(0, -1), index);
    if (WRAPPERS[first] === last) return unwrap(text.slice(1, -1), index + 1);
    return [text, index];
  };

  var getLinks = function getLinks(text) {
    var links = [];
    var match;

    while (match = LINK.exec(text)) {
      var _match = match,
          _match2 = _slicedToArray(_match, 4),
          all = _match2[0],
          protocol = _match2[1],
          preTld = _match2[2],
          tld = _match2[3]; // To qualify as a link, either the protocol or TLD must be specified.


      if (!protocol && !tld) continue;
      var _match3 = match,
          index = _match3.index;

      var _unwrap = unwrap(all, index);

      var _unwrap2 = _slicedToArray(_unwrap, 2);

      all = _unwrap2[0];
      index = _unwrap2[1];
      links.push({
        index: index,
        text: all,
        url: protocol ? all : preTld.indexOf('@') !== -1 ? "mailto:".concat(all) : DEFAULT_PROTOCOL + all
      });
    }

    return links;
  };

  var KeyProxy = function KeyProxy(_ref2) {
    var children = _ref2.children;
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
        components: parts.components.concat(text.slice(parts.index, from), _react["default"].createElement(KeyProxy, {
          key: "".concat(key, "-").concat(i)
        }, props.linkRenderer(link)), i === length - 1 ? text.slice(to) : null)
      };
    }, {
      index: 0,
      components: []
    }).components;
  };

  var renderParagraph = function renderParagraph(text, props) {
    var lines = text.trim().split(LINE_SPLIT);
    return lines.reduce(function (paragraph, line, i) {
      return paragraph.concat(renderLinks(line, i, props), i === lines.length - 1 ? null : _react["default"].createElement("br", {
        key: i
      }));
    }, []);
  };

  var renderParagraphs = function renderParagraphs(props) {
    var children = props.children;
    if (typeof children !== 'string') children = '';
    var paragraphs = children.trim().split(PARAGRAPH_SPLIT);
    return paragraphs.map(function (paragraph, i) {
      return paragraph ? _react["default"].createElement("p", {
        key: i
      }, renderParagraph(paragraph, props)) : null;
    });
  };

  var _default = function _default(_ref3) {
    var _ref3$children = _ref3.children,
        children = _ref3$children === void 0 ? '' : _ref3$children,
        _ref3$linkRenderer = _ref3.linkRenderer,
        linkRenderer = _ref3$linkRenderer === void 0 ? function (_ref4) {
      var url = _ref4.url,
          text = _ref4.text;
      return _react["default"].createElement("a", {
        href: url
      }, text);
    } : _ref3$linkRenderer;
    return _react["default"].createElement(_react["default"].Fragment, null, renderParagraphs({
      children: children,
      linkRenderer: linkRenderer
    }));
  };

  _exports["default"] = _default;
});
