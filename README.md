# <FormattedText />

A React component for formatting line breaks and links.

```jsx
<FormattedText>
  Email me (foo@example.com) or visit one of:

  foo.example.com
  bar.example.com
  baz.example.com
</FormattedText>
```

```html
Email me (<a href="mailto:foo@example.com">foo@example.com</a>) or visit one of:<br />
<br />
<a href="http://foo.example.com">foo.example.com</a><br />
<a href="http://bar.example.com">bar.example.com</a><br />
<a href="http://baz.example.com">baz.example.com</a>
```

### Props

#### LinkComponent

A component that receives `children` and `href` props. Defaults to `'a'`.
