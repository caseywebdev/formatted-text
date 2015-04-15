import React from 'react';

const PARAGRAPH_SPLIT = /\n{2,}/;

const LINE_SPLIT = /\n/;

const LINK = /(\S+?)(\.[a-z-]{2,63})+\S*/gi;

const PROTOCOL = /\w+:\/\//;

const DEFAULT_PROTOCOL = 'http://';

const TERMINATORS = '.,;:?!';

const WRAPPERS = {
  '(': ')',
  '[': ']',
  '"': '"',
  "'": "'",
  '<': '>'
};

const unwrap = (text, index) => {
  const [first, last] = [text[0], text[text.length - 1]];
  if (TERMINATORS.indexOf(last) > -1) return unwrap(text.slice(0, -1), index);
  if (WRAPPERS[first] === last) return unwrap(text.slice(1, -1), index + 1);
  return [text, index];
};

const getLinks = text => {
  const links = [];
  let match;
  while (match = LINK.exec(text)) {
    let [all, preTld, tld] = match;
    const protocol = PROTOCOL.test(preTld);

    // To qualify as a link, either the protocol or TLD must be specified.
    if (!protocol && !tld) continue;

    let {index} = match;
    [all, index] = unwrap(all, index);
    links.push({
      index,
      text: all,
      url:
        protocol ? all :
        preTld.indexOf('@') !== -1 ? `mailto:${all}` :
        DEFAULT_PROTOCOL + all
    });
  }
  return links;
};

const renderText = (text, key) => {
  if (text) return <span key={key}>{text}</span>;
};

const renderLink = (link, key) => {
  return <a key={key} href={link.url}>{link.text}</a>;
};

const renderLinks = (text, key) => {
  const links = getLinks(text);
  if (!links.length) return text;
  const {length} = links;
  return links.reduce((parts, link, i) => {
    const from = link.index;
    const to = from + link.text.length;
    return {
      index: to,
      components: parts.components.concat(
        renderText(text.slice(parts.index, from), `${key}-${i * 2}`),
        renderLink(link, `${key}-${(i * 2) + 1}`),
        i === length - 1 ?
        renderText(text.slice(to), `${key}-${length * 2}`) :
        null
      )
    };
  }, {index: 0, components: []}).components;
};

const renderParagraph = text => {
  const lines = text.trim().split(LINE_SPLIT);
  return lines.reduce((paragraph, line, i) => paragraph.concat(
    renderLinks(line, i * 2),
    i === lines.length - 1 ? null : <br key={(i * 2) + 1} />
  ), []);
};

const renderParagraphs = text => {
  const paragraphs = text.trim().split(PARAGRAPH_SPLIT);
  return paragraphs.map((paragraph, i) =>
    paragraph ? <p key={i}>{renderParagraph(paragraph)}</p> : null
  );
};

export default React.createClass({
  propTypes: {
    children: React.PropTypes.string.isRequired
  },

  render() {
    return <div>{renderParagraphs(this.props.children)}</div>;
  }
});
