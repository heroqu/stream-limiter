const { Transform } = require('stream')

module.exports = StreamLimiter

function StreamLimiter (maxBytes) {
  let sl = new Transform()

  let count = 0 // number of bytes passed through

  sl._transform = function (chunk, encoding, cb) {
    if (count >= maxBytes) {
      // the quota is over, quit
      sl.push(null)
      cb()
      return
    }

    if (typeof chunk === 'string') {
      // convert it to buffer
      chunk = Buffer.from(chunk, encoding)
    }

    if (chunk.length > (maxBytes - count)) {
      // Cut the chunk to respect the quota
      chunk = chunk.slice(0, maxBytes - count)
    }

    count += chunk.length
    sl.push(chunk)

    if (count >= maxBytes) {
      // the quota is over, quit
      sl.push(null)
    }

    cb()
  }

  return sl
}