import RequestMessage from '../RequestMessage.js'

class RenewAllRequest extends RequestMessage {
  constructor (feeAcknowledged) {
    super('65')

    this.feeAcknowledged = feeAcknowledged || null
    this.transactionDate = RequestMessage.getDateTime()
  }

  buildMessage () {
    this.append(this.transactionDate)
    this.append('AO')
    this.append(this.institutionId)
    this.append('|AA')
    this.append(this.patronIdentifier)
    this.append('|AC')
    this.append(this.terminalPassword)
    if (this.itemProperties) {
      this.append('|CH')
      this.append(this.itemProperties)
    }
    if (this.feeAcknowledged !== null) {
      this.append('|BO')
      this.append(this.feeAcknowledged ? 'Y' : 'N')
    }
  }
}

export default RenewAllRequest
