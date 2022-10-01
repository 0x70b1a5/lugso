---
hide: true
---

# lugso: repository for the website of the conlang

This repo contains:

1. The lessons for the [lugso.net] website
1. Tools for re-generating the lessons to match the latest version of the dictionary

The lugso on each page of the lessons is generated from linguistic glosses using Gulp to match the latest form of the language. This means I don't need to go in and change every occurrence of a word in every lesson when I want to make a minor change!

## Inline gloss formatting language

Glosses are surrounded by `${ }$` in markdown files. These glosses are transformed into lugso by the gulp tool.

Some prefixes exist to format the output differently.

1. (no prefix) - (default) Outputs the lugso translation of the gloss.
1. `r: ` - valid for a single gloss term. Outputs the entire row of the dictionary spreadsheet for that term interpolated with `|`, for Markdown tables.
1. `g: ` - outputs the lugso text in `**bold**`, followed by two newlines, followed by the gloss in `\`code\``.

## Usage

```bash
npm i
gulp
# then, update the git repo, and github will rebuild the site.
```