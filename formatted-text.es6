import React from 'react';

const PARAGRAPH_SPLIT = /\n{2,}/;

const LINE_SPLIT = /\n/;

const LINK = /(?:\S+)(\w+:\/\/)\S*|([^\s.]+)(\.[a-z-]{2,63})+\S*/gi;

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
  while ((match = LINK.exec(text))) {
    let [all, protocol, preTld, tld] = match;

    // To qualify as a link, either the protocol or TLD must be specified.
    if (!protocol && !tld) continue;

    let { index } = match;
    [all, index] = unwrap(all, index);
    links.push({
      index,
      text: all,
      url: protocol
        ? all
        : preTld.indexOf('@') !== -1
        ? `mailto:${all}`
        : DEFAULT_PROTOCOL + all
    });
  }
  return links;
};

const KeyProxy = ({ children }) => children;

const renderLinks = (text, key, props) => {
  const links = getLinks(text);
  if (!links.length) return text;
  const { length } = links;
  return links.reduce(
    (parts, link, i) => {
      const from = link.index;
      const to = from + link.text.length;
      return {
        index: to,
        components: parts.components.concat(
          text.slice(parts.index, from),
          <KeyProxy key={`${key}-${i}`}>{props.linkRenderer(link)}</KeyProxy>,
          i === length - 1 ? text.slice(to) : null
        )
      };
    },
    { index: 0, components: [] }
  ).components;
};

const renderParagraph = (text, props) => {
  const lines = text.trim().split(LINE_SPLIT);
  return lines.reduce(
    (paragraph, line, i) =>
      paragraph.concat(
        renderLinks(line, i, props),
        i === lines.length - 1 ? null : <br key={i} />
      ),
    []
  );
};

const renderParagraphs = props => {
  let { children } = props;
  if (typeof children !== 'string') children = '';
  const paragraphs = children.trim().split(PARAGRAPH_SPLIT);
  return paragraphs.map((paragraph, i) =>
    paragraph ? <p key={i}>{renderParagraph(paragraph, props)}</p> : null
  );
};

export default ({
  children = '',
  linkRenderer = ({ url, text }) => <a href={url}>{text}</a>
}) => <>{renderParagraphs({ children, linkRenderer })}</>;
