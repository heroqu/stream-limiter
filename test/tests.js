const { assert } = require('chai')
const { Readable } = require('readable-stream')
const StreamAccumulator = require('./stream_accumulator')
const StreamLimiter = require('../')

describe('StreamLimiter', function () {
  let rs, ws

  beforeEach(function () {
    // sample readable stream of 14 bytes
    rs = new Readable()
    rs.push(Buffer.from(
      [77, 97, 114, 115, 104, 97, 108, 32, 90, 104, 117, 107, 111, 118]
    ))
    rs.push(null)

    // sample writable stream, the end sink
    ws = StreamAccumulator()
  })

  it('should limit sample byte stream to first 7 bytes', function (done) {
    let sl = StreamLimiter(7)

    rs.pipe(sl).pipe(ws)

    ws.on('finish', _ => {
      assert.equal(ws.buffer().length, 7, '7 bytes received at the sink')
      assert.equal(ws.buffer().toString(), 'Marshal', 'Ascii string is correct')
      done()
    })
  })

  it('should not limit the stream, if limit is Infinity', function (done) {
    let sl = StreamLimiter(Infinity)

    rs.pipe(sl).pipe(ws)

    ws.on('finish', _ => {
      assert.equal(ws.buffer().length, 14, 'All 14 bytes received at the sink')
      assert.equal(ws.buffer().toString(), 'Marshal Zhukov',
        'Ascii string is correct')
      done()
    })
  })

  it('should not pass a single byte if limit is less then 1', function (done) {
    let sl = StreamLimiter(0.99)

    rs.pipe(sl).pipe(ws)

    ws.on('finish', _ => {
      assert.equal(ws.buffer().length, 0, 'Zero bytes received at the sink')
      assert.equal(ws.buffer().toString(), '', 'Ascii string is correct')
      done()
    })
  })

  it('should not pass a single byte if limit is negative', function (done) {
    let sl = StreamLimiter(-7)

    rs.pipe(sl).pipe(ws)

    ws.on('finish', _ => {
      assert.equal(ws.buffer().length, 0, 'Zero bytes received at the sink')
      assert.equal(ws.buffer().toString(), '', 'Ascii string is correct')
      done()
    })
  })

  it('should not pass a single byte if limit is -Infinity', function (done) {
    let sl = StreamLimiter(-Infinity)

    rs.pipe(sl).pipe(ws)

    ws.on('finish', _ => {
      assert.equal(ws.buffer().length, 0, 'Zero bytes received at the sink')
      assert.equal(ws.buffer().toString(), '', 'Ascii string is correct')
      done()
    })
  })
})
