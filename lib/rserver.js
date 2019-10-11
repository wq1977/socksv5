const net = require('net')
const dns = require('dns')
const through = require('through2')

class RServer {
    constructor(options) {
        this.options = options
    }
    start () {
        const {encode, decode} = this.options
        const server = net.createServer(function(socket) {
            let connected = false
            this.onData = (data) => {
                if (connected) return
                connected = true
                const req = JSON.parse(decode(data).toString('utf-8'))
                socket.removeListener('data', this.onData)
                socket.pause()
                dns.lookup(req.dstAddr, function(err, dstIP) {
                    if (err) {
                        socket.end()
                        return;
                    }
                    var dstSock = new net.Socket()
                    dstSock.setKeepAlive(false);
                    dstSock.on('error', () => {socket.end()})
                           .on('connect', function() {
                             if (socket.writable) {
                              socket.write('OK')
                              socket.pipe(through(function(chunk,enc,callback){
                                  this.push(decode(chunk))
                                  callback()
                              })).pipe(dstSock).pipe(through(function(chunk, enc, callback) {
                                  this.push(encode(chunk))
                                  callback()
                              })).pipe(socket);
                              socket.resume();
                             } else if (dstSock.writable)
                              dstSock.end();
                           })
                           .connect(req.dstPort, dstIP);        
                })
            }
            socket.on('data', this.onData)
        })
        
        server.listen(this.options.rport)
    }
}

module.exports = {
    RServer
}