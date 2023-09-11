# Params

Control your website content using query parameters.

## Installation

Add `Params` to your project using npm:

```bash
npm install @burcs/params
```

Or, embed the script directly on your website.

## Quick Start

`Params` is designed for ease of use. Modify content based on the order of site elements. For example, to alter the second paragraph on a page:

```html
https://params.org/page?p_2=updated+content+here
```

## Party Mode 🎉

Activate "Party Mode" to effortlessly update your site. By enabling this mode, you can edit your page content in-line. Try it out:

```html
https://params.org/page?party=true
```

Make your changes, enjoy the party!

## Supported Elements

Currently, `Params` supports:

- Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Text & Styling: `p`, `i`, `b`, `span`
- Lists: `ul`, `ol`
- Media: `img`

More elements are in the pipeline.

## Styling on the Fly

Change element styles by invoking different CSS classes:

```html
https://params.org/page?p_2_class=class-name
```

This feature works well with libraries like TailwindCSS.

## Security

Image sources are limited to whitelisted domains to prevent malicious code injections.

## Contribute

`Params` is open-source. Submit a PR if you have suggestions or improvements.

## License

MIT License.
