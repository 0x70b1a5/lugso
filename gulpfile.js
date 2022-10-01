const { parallel, src, dest } = require('gulp')
const through2 = require('through2')

console.log(process.cwd())

const paths = {
  lessons: {
    src: './lessons/*',
    dest: './'
  }
}

function lugsoifyAll(cb) {
  return src(paths.lessons.src)
  .pipe(through2.obj(function(file, _, cb) {
    console.log(file)
    cb(null, file);
  }))
  .pipe(dest(paths.lessons.dest))
} 

const build = parallel(lugsoifyAll)

exports.default = build;