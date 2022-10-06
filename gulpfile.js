const { series, src, dest } = require('gulp')
const through2 = require('through2')
const { glossToLugso, getSheet, rowsToMap, ipaify, getWord } = require('./assets/lugso')
const Vinyl = require('vinyl')

console.log(process.cwd())

const paths = {
  lessons: {
    src:  process.cwd() + '/raw/*',
    dest: process.cwd() + '/lessons',
  }
}

function copy () {
  return src(paths.lessons.src)
  .pipe(dest(paths.lessons.dest));
}

async function lugsoifyAll(cb) {
  var rows = await getSheet()
  return src(paths.lessons.src)
  .pipe(through2.obj(function(vinyl, _, cb) {
    let fileContents = vinyl.contents.toString()
    fileContents = fileContents.replace(/hide: true/, '')
    const matches = [...fileContents.matchAll(/\${(.*?)}/g)]

    if (matches.length) {
      const map = rowsToMap(rows)
      for (const match of matches) {
        let meat = match[1]
        const sliced = meat.split(' ')
        const slice0 = sliced[0]
        const slice1 = sliced[1] 
        let out = ''
        if (slice0 == 'g:') { 
          meat = meat.slice(3)
          out = `**${glossToLugso(meat, map)}**

\`${meat}\``
        } else if (slice0 == 'r:') {
          const row = getWord(slice1, map, true)
          if (!row) throw `could not find row for meat: ${meat}`
          out = `${row.english}|${row.partOfSpeech}|${ipaify(row.lugso)}|${row.lugso}|${row.notes || ''}`
        } else {
          out = glossToLugso(meat, map)
        }

        fileContents = fileContents.replace(/\${(.*?)}\$/, out)
      }
    }

    const newV = new Vinyl({
      ...vinyl, 
      contents: Buffer.from(fileContents, 'utf8') 
    })

    cb(null, newV);
  }))
  .pipe(dest(paths.lessons.dest))
} 

const build = series(lugsoifyAll)

exports.default = build;