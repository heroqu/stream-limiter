const { Transform } = require('readable-stream')

module.exports = StreamLimiter

function StreamLimiter (maxBytes) {
  let sl = new Transform()

  let count = 0 // number of bytes passed through

  sl._transform = function (chunk, encoding, cb) {
    if (count >= maxBytes) {
      // the quota is over, quit
      quit()
      cb()
      return
    }

    if (chunk.length > (maxBytes - count)) {
      // Cut the chunk to respect the quota
      chunk = chunk.slice(0, maxBytes - count)
    }

    count += chunk.length
    sl.push(chunk)

    if (count >= maxBytes) {
      // the quota is over, quit
      quit()
    }

    cb()
  }

  function quit () {
    sl.push(null)       // output stream will know we quit here
    sl.emit('finish')   // input stream will know
  }

  return sl
}
