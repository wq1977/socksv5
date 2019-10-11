function encode(buffer) {
    for (let i=0;i <buffer.length; i++) {
        buffer[i] += 20
    }
    return buffer
}

function decode(buffer) {
    for (let i=0;i <buffer.length; i++) {
        buffer[i] -= 20
    }
    return buffer
}

module.exports = {
    encode, decode
}