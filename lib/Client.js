import net from 'net'
import parse from './parseResponse.js'

class Client {
  constructor (init) {
    this.host = init.host || 'localhost'
    this.port = init.port || 6001
    this.tzOffset = init.timezoneOffset || '+0000'
    this.dueDateFormat = `${init.dueDateFormat}...` || 'YYYYMMDD...'
    this.terminator = init.terminator || 'CR'
    this.verbose = init.verbose || false
    this.debug = init.debug || false
    this.socket = null
  }

  connect () {
    this.socket = new net.Socket()
    this.socket.setEncoding('utf8')

    this.socket.on('end', () => {
      // console.log('Disconnected from SIP2 server')
      this.socket.removeAllListeners()
    })

    this.socket.on('close', () => {
      // console.log('SIP2 connection closed')
      this.socket.removeAllListeners()
    })

    this.socket.on('error', (error) => {
      console.log('SIP2 connection error', error)
    })

    this.socket.connect(this.port, this.host)
    return this
  }

  send (message) {
    const client = this
    if (!client.socket) {
      return (new Error('No open SIP2 socket connection'))
    }

    switch (this.terminator) {
      case 'CRLF':
        message += '\r\n'
        break
      case 'CR':
        message += '\r'
    }

    return new Promise((resolve, reject) => {
      const debugData = this.debug
      const payload = {
        dueDateFormat: this.dueDateFormat,
        tzOffset: this.tzOffset,
        verbose: this.verbose
      }
      client.socket.write(message)
      client.socket.on('data', function getData (data) {
        this.removeListener('data', getData)
        payload.message = data
        const response = parse(payload)
        if (debugData) {
          response.debugData = {
            request: message,
            response: data
          }
        }
        resolve(response)
      })

      client.socket.on('error', err => reject(err))
    })
  }

  close () {
    if (this.socket) {
      this.socket.end()
      this.socket.removeAllListeners()
      this.socket.destroy()
    }
  }
}

export default Client
