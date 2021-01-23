import { Fragment, createElement } from 'react';

const linkRegexp = /(?:\S+)(\w+:\/\/)\S*|[^\s.]+(\.[a-z-]{2,63})+\S*/gim;

const headerRegexp = /^(#+)[^#\r\n].*$/gm;

const defaultProtocol = 'http://';

const terminators = '.,;:?!';

const wrappers = {
  '(': ')',
  '[': ']',
  '"': '"',
  "'": "'",
  '<': '>'
};

const unwrap = (text, index) => {
  const [first, last] = [text[0], text[text.length - 1]];
  if (terminators.indexOf(last) > -1) return unwrap(text.slice(0, -1), index);
  if (wrappers[first] === last) return unwrap(text.slice(1, -1), index + 1);
  return [text, index];
};

const comparator = (a, b) =>
  a.from < b.from ? -1 : a.from > b.from ? 1 : a.to >= b.to ? -1 : 1;

const getBlocks = text => {
  const blocks = [];

  let match;

  while ((match = headerRegexp.exec(text))) {
    blocks.push({
      type: 'header',
      from: match.index,
      to: match.index + match[0].length,
      props: { level: match[1].length }
    });
  }

  while ((match = linkRegexp.exec(text))) {
    let [all, protocol, tld] = match;

    // To qualify as a link, either the protocol or TLD must be specified.
    if (!protocol && !tld) continue;

    let { index } = match;
    [all, index] = unwrap(all, index);
    blocks.push({
      type: 'link',
      from: index,
      to: index + all.length,
      props: {
        href: protocol
          ? all
          : all.includes('@')
          ? `mailto:${all}`
          : defaultProtocol + all
      }
    });
  }

  return blocks.sort(comparator);
};

const renderBlocks = ({ blocks, render, text }) => {
  if (!blocks.length) return [text];

  const components = [text.slice(0, blocks[0].from)];
  for (let i = 0; i < blocks.length; ++i) {
    const { from, to, type, props } = blocks[i];
    const subtext = text.slice(from, to);
    const subBlocks = [];
    for (let j = i + 1; j < blocks.length; ++j) {
      const subBlock = blocks[j];
      if (subBlock.to > to) break;

      subBlocks.push({
        ...subBlock,
        from: subBlock.from - from,
        to: subBlock.to - from
      });
      ++i;
    }
    const children = renderBlocks({ blocks: subBlocks, render, text: subtext });
    components.push(
      createElement(Fragment, { key: i }, render({ children, type, ...props }))
    );

    components.push(text.slice(to, blocks[i + 1]?.from));
  }

  return components;
};

const defaultRender = ({ type, children, ...props }) => {
  if (type === 'link') return createElement('a', props, children);

  if (type === 'header') {
    children = [children[0].replace(/^#*\s*/, ''), ...children.slice(1)];
    return createElement(`h${Math.min(props.level, 6)}`, { children });
  }

  return null;
};

export default ({ children: text, render = defaultRender }) =>
  typeof text === 'string'
    ? renderBlocks({ blocks: getBlocks(text), render, text })
    : null;
