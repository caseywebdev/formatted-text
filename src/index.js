import { Fragment, createElement } from 'react';

const local = "[\\w!#$%&'*+/=?^{|}~-]+";
const tlds = [
  'au',
  'biz',
  'ca',
  'co',
  'com',
  'me',
  'net',
  'org',
  'uk',
  'us'
].sort((a, b) => b.length - a.length);
const domain = '(?:[a-z]([a-z0-9-]*[a-z0-9])?)';
const linkRegexp = new RegExp(
  // local email part or scheme
  `(${local}(?:\\.${local})*@|[a-z0-9.+-]+://)?` +
    // domain
    `(?:${domain}\\.)+(?:${tlds.join('|')})` +
    // path
    `(?:/\\S*)?`,
  'gi'
);

const headerRegexp = /^(#+)[^#\r\n].*$/gm;

const atMentionRegexp = /@[^@\r\n]+/g;

const initiators = '@#';

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
  if (wrappers[first] === last) return unwrap(text.slice(1, -1), index + 1);
  if (initiators.indexOf(first) > -1) return unwrap(text.slice(1), index + 1);
  if (terminators.indexOf(last) > -1) return unwrap(text.slice(0, -1), index);
  return [text, index];
};

const comparator = (a, b) =>
  a.from < b.from ? -1 : a.from > b.from ? 1 : a.to >= b.to ? -1 : 1;

const getBlocks = ({ context, text, offset = 0, previousBlocks = [] }) => {
  const { getAtMentionable, indexMarkers } = context ?? {};
  const offsetText = text.slice(offset);
  const blocks = [
    ...previousBlocks,

    ...(offset === 0
      ? (indexMarkers ?? []).map(({ index, ref }) => ({
          type: 'indexMarker',
          from: index,
          to: index,
          props: { ref }
        }))
      : []),

    ...[...offsetText.matchAll(headerRegexp)].map(
      ({ 0: { length }, 1: { length: level }, index }) => ({
        type: 'header',
        from: offset + index,
        to: offset + index + length,
        props: { level }
      })
    ),

    ...[...offsetText.matchAll(linkRegexp)].flatMap(
      ({ 0: all, 1: prefix, index }) => {
        [all, index] = unwrap(all, index);
        return {
          type: 'link',
          from: offset + index,
          to: offset + index + all.length,
          props: {
            href: !prefix
              ? `https://${all}`
              : prefix.endsWith('@')
                ? `mailto:${all}`
                : all
          }
        };
      }
    ),

    ...(getAtMentionable
      ? [...offsetText.matchAll(atMentionRegexp)].flatMap(
          ({ 0: all, index }) => {
            const mentionable = getAtMentionable(all.slice(1));
            return mentionable
              ? {
                  type: 'atMention',
                  from: offset + index,
                  to: offset + index + 1 + mentionable.length,
                  props: { mentionable }
                }
              : [];
          }
        )
      : [])
  ].sort(comparator);

  for (let i = 0; i < blocks.length - 1; ++i) {
    const blockA = blocks[i];
    for (let j = i + 1; j < blocks.length; ++j) {
      const blockB = blocks[j];
      if (blockB.from >= blockA.to) break;

      if (blockB.to > blockA.to) {
        return getBlocks({
          context,
          offset: blockA.to,
          previousBlocks: blocks.slice(0, i + 1),
          text
        });
      }
    }
  }

  return blocks;
};

// eslint-disable-next-line no-unused-vars
const fallbackRender = ({ children, context, type, ...props }) => {
  if (type === 'link') return createElement('a', props, children);

  if (type === 'header') {
    if (typeof children[0] !== 'string') return children;

    children = [children[0].replace(/^#*\s*/, ''), ...children.slice(1)];
    return createElement(`h${Math.min(props.level, 6)}`, null, children);
  }

  if (type === 'indexMarker') return createElement('span', props);

  return children;
};

const renderBlocks = ({ blocks, context, render, text }) => {
  if (!blocks.length) return [text];

  const components = [];
  const before = text.slice(0, blocks[0].from);
  if (before) components.push(before);
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
    const children = renderBlocks({
      blocks: subBlocks,
      context,
      render,
      text: subtext
    });
    const renderArgs = { children, context, type, ...props };
    let rendered = render?.(renderArgs);
    if (rendered === undefined) rendered = fallbackRender(renderArgs);
    components.push(createElement(Fragment, { key: i }, rendered));

    const after = text.slice(to, blocks[i + 1]?.from);
    if (after) components.push(after);
  }

  return components;
};

export default ({ children: text, context, render }) =>
  typeof text === 'string'
    ? renderBlocks({
        blocks: getBlocks({ context, text }),
        context,
        render,
        text
      })
    : null;
