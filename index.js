const { Transform } = require('readable-stream');

function StreamLimiter(maxBytes) {
  const sl = new Transform();

  function quit() {
    sl.push(null); // output stream will know we quit here
    sl.emit('finish'); // input stream will know
  }

  let count = 0; // number of bytes passed through

  /* eslint no-underscore-dangle: ["error", { "allow": ["_transform"] }] */
  sl._transform = function _transform(chunk, encoding, cb) {
    if (count >= maxBytes) {
      // the quota is over, quit
      quit();
      cb();
      return;
    }

    if (chunk.length > maxBytes - count) {
      // Cut the chunk to respect the quota
      chunk = chunk.slice(0, maxBytes - count);
    }

    count += chunk.length;
    sl.push(chunk);

    if (count >= maxBytes) {
      // the quota is over, quit
      quit();
    }

    cb();
  };

  return sl;
}

module.exports = StreamLimiter;
