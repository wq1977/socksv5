const {Server} = require('./index')
const {encode, decode} = require('./encrypt')

const options = {
    ssserver: '127.0.0.1',
    ssport: 8848,
    s5port: 2087,
    encode,
    decode  
}

const srv = new Server(options)
srv.listen(options.s5port, 'localhost', function() {
  console.log(`SOCKS server listening on port ${options.s5port}`);
});
  
srv.useAuth(require('./lib/auth/None')())