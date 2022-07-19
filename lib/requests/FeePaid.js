import RequestMessage from '../RequestMessage.js'
import DataTypes from '../DataTypes.js'

class FeePaidRequest extends RequestMessage {
  constructor (feeType, paymentType, currency, feeAmount, feeIdentifier, transactionId) {
    super('37')

    this.feeType = feeType || DataTypes.FeeType.OTHER_UNKNOWN
    this.paymentType = paymentType || DataTypes.PaymentType.CASH
    this.currency = currency
    this.feeAmount = feeAmount
    this.feeIdentifier = feeIdentifier
    this.transactionId = transactionId
    this.transactionDate = RequestMessage.getDateTime()
  }

  buildMessage () {
    this.append(this.transactionDate)
    this.append(this.feeType)
    this.append(this.paymentType)
    this.append(this.currency)
    this.append('BV')
    this.append(this.feeAmount)
    this.append('|AO')
    this.append(this.institutionId)
    this.append('|AA')
    this.append(this.patronIdentifier)
    if (this.terminalPassword) {
      this.append('|AC')
      this.append(this.terminalPassword)
    }
    if (this.patronPassword) {
      this.append('|AD')
      this.append(this.patronPassword)
    }
    if (this.feeIdentifier) {
      this.append('|CG')
      this.append(this.feeIdentifier)
    }
    if (this.transactionId) {
      this.append('|BK')
      this.append(this.transactionId)
    }
  }
}

export default FeePaidRequest
