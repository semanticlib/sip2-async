import date from 'date-and-time'

class RequestMessage {
  constructor (identifier) {
    // Command identifier
    this.identifier = identifier

    // Build message
    this.message = ''
    this.institutionId = ''
    this.terminalPassword = ''
    this.patronIdentifier = ''
    this.patronPassword = ''
    this.language = '001'
    this.errorDetection = true
    this.sequence = 0

    if (this.sequence > 9) {
      this.sequence = 0
    }
    this.includeSequenceNumber = true
  }

  append (value) {
    if (value) {
      this.message += value
    }
  }

  buildMessage () {
    throw new Error('Method needs to be implemented by sub class')
  }

  getMessage () {
    this.message = ''

    if (this.identifier) {
      this.append(this.identifier)
    }

    this.buildMessage()

    if (this.errorDetection) {
      if (this.includeSequenceNumber) {
        this.append(`|AY${this.sequence}`)
      }
      this.append('AZ')
      this.append(this.createChecksum(this.message))
    }

    return this.message
  }

  createChecksum (message) {
    const messageChars = message.split('')
    let checksum = 0
    messageChars.forEach((char) => {
      checksum += char.charCodeAt(0)
    })
    checksum = -(checksum & 0xFFFF)
    return (checksum >>> 0).toString(16).substring(4, 8).toUpperCase()
  }

  static getDateTime (dateTime) {
    if (!dateTime) {
      dateTime = new Date()
    }
    return date.format(dateTime, 'YYYYMMDD    HHmmss')
  }
}

export default RequestMessage
