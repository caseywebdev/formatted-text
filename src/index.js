import React, { Fragment } from 'react';

const LINK = /(?:\S+)(\w+:\/\/)\S*|[^\s.]+(\.[a-z-]{2,63})+\S*/gi;

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
    let [all, protocol, tld] = match;

    // To qualify as a link, either the protocol or TLD must be specified.
    if (!protocol && !tld) continue;

    let { index } = match;
    [all, index] = unwrap(all, index);
    links.push({
      index,
      children: all,
      href: protocol
        ? all
        : all.includes('@')
        ? `mailto:${all}`
        : DEFAULT_PROTOCOL + all
    });
  }
  return links;
};

const renderLinks = ({ LinkComponent, text }) => {
  const links = getLinks(text);
  if (!links.length) return text;

  return links.reduce(
    (parts, { index, children, href }, i, { length }) => {
      const from = index;
      const to = from + children.length;
      return {
        index: to,
        components: parts.components.concat(
          text.slice(parts.index, from),
          <LinkComponent key={i} href={href}>
            {children}
          </LinkComponent>,
          i === length - 1 ? text.slice(to) : []
        )
      };
    },
    { index: 0, components: [] }
  ).components;
};

export default ({ children, LinkComponent = 'a' }) => {
  if (typeof children !== 'string') return null;

  return children
    .trim()
    .split('\n')
    .map((line, i, lines) => (
      <Fragment key={i}>
        {renderLinks({ LinkComponent, text: line })}
        {i < lines.length - 1 ? <br /> : null}
      </Fragment>
    ));
};
