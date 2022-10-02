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

```
${consume 1SG}$ -> 
    huf kur
${g: consume 1SG}$ -> 
    **g: huf kur-ir luk**
          
    `g: consume 1SG-ACC 2SG`
${r: consume 1SG}$ ->  # note that '1SG' is ignored; r: only takes the first gloss
    consume|V|kur|see 'eat'
```

1. (no prefix) - Intakes a list of glosses separated by spaces. Outputs lugso.
1. `g: ` - Intakes a list of glosses separated by spaces. Outputs lugso in `**bold**`, followed by two newlines, followed by the gloss in `\`code\``.
1. `r: ` - Intakes a single gloss. Outputs the entire row of the dictionary spreadsheet, interpolated with `|`, for Markdown tables.

## Usage

```bash
npm i
gulp
# then, update the git repo, and github will rebuild the site.
```