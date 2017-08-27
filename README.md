# stream-limiter

A PassThrough stream that stops streaming after the specified bytes number has been passed.

Does not support *objectMode*.

## Setup

```shell
npm install stream-limiter
```

## Implementation details

Works on bytes level, means it always count bytes and not characters, even if it is inserted into the chain of text streams.

Please note, that for text streams some characters can take more then one byte and thus can be cut off in the middle at the end of the resulting stream. This is an intentional behavior, as the exact byte size is considered to be more important here.

## Usage

```javascript
const StreamLimiter = require('stream-limiter')
const { Readable } = require('stream')

// Sample readable stream of 8 bytes.
// The bytes might (but not have to) be interpreted as 8 ascii chars:
//  'M', 'a', 'r', 's', 'h', 'a', 'l', 'l'
const rs = new Readable()
rs.push(Buffer.from([77, 97, 114, 115, 104, 97, 108, 108]))
rs.push(null)

// limiter PassThrough stream with maxBytes = 7
const sl = StreamLimiter(7)

// pipe through it
rs.pipe(sl).pipe(process.stdout)
// output > Marshal     (without last 'l')
```

The only constructor parameter is the ```maxBytes``` - number of bytes allowed to pass through the stream.

This can be any number, including ```+Infinity```. Numbers less then 1 (e.g. 0, 0.99, -5, ```-Infinity```) are treated as zero bytes limit, thus the stream will end (and emit the 'finish' event) immediately after streaming has began.

Any other value (like ```NaN```, or of any type other the ```Number```) will be interpreted as ```+Infinity``` and act as if there is no limit.

## Dependencies

None.
