const { Writable } = require('readable-stream')

module.exports = StreamAccumulator

function StreamAccumulator () {
  let sa = new Writable({
    objectMode: false // object mode is not supported
  })

  // will accumulate incoming bytes here
  let buf = Buffer.alloc(0) // start with empty buffer

  sa._write = function (chunk, encoding, cb) {
    if (!(chunk instanceof Buffer)) {
      // convert to a Buffer
      chunk = Buffer.from(chunk)
    }
    buf = Buffer.concat([buf, chunk]) // add bytes
    cb()
  }

  // getter for the result
  sa.buffer = function(){
    return Buffer.from(buf)
  }

  return sa
}
