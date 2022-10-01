const { parallel, src, dest } = require('gulp')
const through2 = require('through2')
const { glossify } = require('./assets/lugso')

console.log(process.cwd())

const paths = {
  lessons: {
    src: './lessons/*',
    dest: './'
  }
}

function lugsoifyAll(cb) {
  return src(paths.lessons.src)
  .pipe(through2.obj(function(vinyl, _, cb) {
    const v = vinyl.contents.toString()
    const matches = v.match(/\${(.*?)}/g)

    if (matches) {
      console.log(matches)
    }

    cb(null, vinyl);
  }))
  .pipe(dest(paths.lessons.dest))
} 

const build = parallel(lugsoifyAll)

exports.default = build;