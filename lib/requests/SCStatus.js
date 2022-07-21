import RequestMessage from '../RequestMessage.js'
import DataTypes from '../DataTypes.js'

class SCStatusRequest extends RequestMessage {
  constructor (status, maxPrintWidth, protocolVersion) {
    super('99')

    this.sequence = 2
    this.statusCode = status || DataTypes.StatusCode.OK
    this.maxPrintWidth = maxPrintWidth || '000'
    this.protocolVersion = protocolVersion || '2.00'
  }

  buildMessage () {
    this.append(this.statusCode)
    this.append(this.maxPrintWidth)
    this.append(this.protocolVersion)
  }
}

export default SCStatusRequest
