# <FormattedText />

A React component for formatting paragraphs, line breaks and links.

```jsx
<FormattedText>
  Email me (foo@example.com) or visit foo.example.com.
</FormattedText>
```

```html
<div>
  <p>
    Email me (<a href="mailto:foo@example.com">foo@example.com</a>) or visit <a href="http://foo.example.com">foo.example.com</a>.
  </p>
</div>
```

### Props

#### renderLink

A function that receives `{url, text}` and returns what to render in place of
the found link. By default this function simply returns `<a
href={url}>{text}</a>`, but can be customized to turn YouTube/SoundCloud/etc
links into embedded media. See the example page for a demonstration.
