const {RServer} = require('./lib/rserver')
const {encode, decode} = require('./encrypt')

const server = new RServer({
    rport: 8848,
    encode,
    decode
})
server.start()