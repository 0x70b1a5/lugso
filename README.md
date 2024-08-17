---
hide: true
---

# lugso: repository for the website of the conlang

[![pages-build-deployment](https://github.com/0x70b1a5/lugso/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/0x70b1a5/lugso/actions/workflows/pages/pages-build-deployment)

This repo contains:

1. The lessons for the [lugso.net] website
1. Tools for re-generating the lessons to match the latest version of the [dictionary](https://docs.google.com/spreadsheets/d/1w5AXgGZ8VKgCwW03Gdz1VmijRRQw0fJRSU8y4XvD28E/)

The lugso on each page of the lessons is generated from linguistic glosses using [Gulp](https://npmjs.com/package/gulp) to match the latest form of the language. This means I don't need to go in and change every occurrence of a word in every lesson when I want to make a minor change!

## Inline gloss formatting language

Glosses are surrounded by `${ }$` in markdown files. These glosses are transformed into lugso by the gulp tool.

Some prefixes exist to format the output differently.

```sh
${consume 1SG}$ -> 
    huf kur

${g: consume 1SG}$ -> 
    **huf kur-ir luk**
          
    `consume 1SG-ACC 2SG`

${r: consume 1SG}$ ->  # note that '1SG' is ignored; r: only takes the first gloss
    consume|V|kur|see 'eat'
```

1. no prefix (default) - Intakes a list of glosses separated by spaces. Outputs lugso.
1. `d: ` - Calls debugger during execution.
1. `g: ` - Intakes a list of glosses separated by spaces. Outputs lugso in `**bold**`, followed by two newlines, followed by the gloss in `\`code\``.
1. `i: ` - outputs IPA symbols instead of latinized lugso.
1. `l: ` - intakes a gloss. Outputs the gloss in latinized form.
1. `r: ` - Intakes a single gloss. Outputs the entire row of the dictionary spreadsheet, interpolated with `|`, for Markdown tables.
1. `s: ` - outputs IPA symbols and a button to click, which will make an API call to play synthesized audio reading of the lugso.

## Usage

```sh
npm i
gulp
git commit -am 'update'
git push
# github rebuilds website after receiving push, may take a few minutes.
```