var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

(function (root, factory) {
  if (typeof define === "function" && define.amd) define(["react"], factory);else if (typeof exports !== "undefined") {
    module.exports = factory(require("react"));
  } else root.FormattedText = factory(root.React);
})(this, function (React) {
  "use strict";

  var PARAGRAPH_SPLIT = /\n{2,}/;

  var LINE_SPLIT = /\n/;

  var LINK = new RegExp(

  // Group 1: Option 1, protocol specified
  "([a-z]+://\\S+)" +

  // OR
  "|" +

  // Group 2: Option 2, TLD specified
  // Group 3: Pre-TLD section
  "((\\S+?)\\.[a-z-]{2,63}\\S*)", "gi");

  var DEFAULT_PROTOCOL = "http://";

  var TERMINATORS = {
    ".": true
  };

  var WRAPPERS = {
    "(": ")",
    "[": "]",
    "\"": "\"",
    "'": "'",
    "<": ">"
  };

  var unwrap = function (text, index) {
    var first = text[0];
    var last = text[text.length - 1];

    if (TERMINATORS[last]) return unwrap(text.slice(0, -1), index);
    if (WRAPPERS[first] === last) return unwrap(text.slice(1, -1), index + 1);
    return [text, index];
  };

  var getLinks = function (text) {
    var links = [];
    var match = undefined;
    while (match = LINK.exec(text)) {
      var _match = _slicedToArray(match, 4);

      var all = _match[0];
      var protocol = _match[1];
      var tld = _match[2];
      var preTld = _match[3];

      // To qualify as a link, either the protocol or TLD must be specified.
      if (!protocol && !tld) continue;

      var index = match.index;

      var _ref = unwrap(all, index);

      var _ref2 = _slicedToArray(_ref, 2);

      all = _ref2[0];
      index = _ref2[1];

      links.push({
        index: index,
        text: all,
        url: protocol ? all : preTld.indexOf("@") !== -1 ? "mailto:" + all : DEFAULT_PROTOCOL + all
      });
    }
    return links;
  };

  var renderText = function (text, key) {
    if (text) return React.createElement(
      "span",
      { key: key },
      text
    );
  };

  var renderLink = function (link, key) {
    return React.createElement(
      "a",
      { key: key, href: link.url },
      link.text
    );
  };

  var renderLinks = function (text, key) {
    var links = getLinks(text);
    if (!links.length) return text;
    var length = links.length;

    return links.reduce(function (parts, link, i) {
      var from = link.index;
      var to = from + link.text.length;
      return {
        index: to,
        components: parts.components.concat(renderText(text.slice(parts.index, from), "" + key + "-" + i * 2), renderLink(link, "" + key + "-" + (i * 2 + 1)), i === length - 1 ? renderText(text.slice(to), "" + key + "-" + length * 2) : null)
      };
    }, { index: 0, components: [] }).components;
  };

  var renderParagraph = function (text) {
    var lines = text.trim().split(LINE_SPLIT);
    return lines.reduce(function (paragraph, line, i) {
      return paragraph.concat(renderLinks(line, i * 2), i === lines.length - 1 ? null : React.createElement("br", { key: i * 2 + 1 }));
    }, []);
  };

  var renderParagraphs = function (text) {
    var paragraphs = text.trim().split(PARAGRAPH_SPLIT);
    return paragraphs.map(function (paragraph, i) {
      return paragraph ? React.createElement(
        "p",
        { key: i },
        renderParagraph(paragraph)
      ) : null;
    });
  };

  return React.createClass({
    render: function render() {
      var text = this.props.children || "";
      return React.createElement(
        "div",
        null,
        renderParagraphs(text)
      );
    }
  });
});
