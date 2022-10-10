const { series, src, dest } = require('gulp')
const through2 = require('through2')
const { glossToLugso, getSheet, rowsToMap, ipaify, getWord, speak, phonotact } = require('./assets/lugso')
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
          const rest = meat.slice(3)
          out = `**${glossToLugso(rest, map)}**

\`${rest}\``
        } else if (slice0 == 'r:') {
          const row = getWord(slice1, map, true) // r function drops all but first word
          if (!row) throw `could not find row for meat: ${meat}`
          const lugso = glossToLugso(slice1, map)
          out = `${row.english}|${row.partOfSpeech}|${ ipaify(lugso, true) }|${lugso}|${row.notes || ''}`
        } else if (slice0 == 'i:') {
          const lugso = glossToLugso(meat.slice(3), map)
          out = ipaify(lugso)
        } else if (slice0 == 's:') {
          const lugso = glossToLugso(meat.slice(3), map)
          out = speak(ipaify(lugso))
        } else {
          out = glossToLugso(meat, map)
        }

        // since we only ever replace the first occurrence,
        //   this should work through the entire file in an iterared fashion.
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