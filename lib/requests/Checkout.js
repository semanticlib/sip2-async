import RequestMessage from '../RequestMessage.js'

class CheckoutRequest extends RequestMessage {
  constructor (scRenewalPolicy, nbDueDate, itemIdentifier, itemProperties, feeAcknowledged, noBlock = false) {
    super('11')

    this.sequence = 2
    this.scRenewalPolicy = scRenewalPolicy

    // no block means date in nbDueDate was given as duedate while in offline mode and ils shall accept that/no block
    this.noBlock = noBlock
    this.itemIdentifier = itemIdentifier
    this.nbDueDate = nbDueDate || RequestMessage.getDateTime()
    this.itemProperties = itemProperties || ''
    this.feeAcknowledged = feeAcknowledged || null
    this.transactionDate = RequestMessage.getDateTime()
    this.cancel = null
  }

  buildMessage () {
    this.append(this.scRenewalPolicy ? 'Y' : 'N')
    this.append(this.noBlock ? 'Y' : 'N')
    this.append(this.transactionDate)
    this.append(this.nbDueDate)
    this.append('AO')
    this.append(this.institutionId)
    this.append('|AA')
    this.append(this.patronIdentifier)
    this.append('|AB')
    this.append(this.itemIdentifier)
    this.append('|AC')
    this.append(this.terminalPassword)
    if (this.itemProperties) {
      this.append('|CH')
      this.append(this.itemProperties)
    }
    if (this.patronPassword) {
      this.append('|AD')
      this.append(this.patronPassword)
    }
    if (this.feeAcknowledged !== null) {
      this.append('|BO')
      this.append(this.feeAcknowledged ? 'Y' : 'N')
    }
    if (this.cancel !== null) {
      this.append('|BI')
      this.append(this.cancel ? 'Y' : 'N')
    }
  }
}

export default CheckoutRequest
