import RequestMessage from '../RequestMessage.js'

class RequestResendRequest extends RequestMessage {
  constructor () {
    super('97')

    this.sequence = 2
    this.includeSequenceNumber = false
  }

  buildMessage () {
  }
}

export default RequestResendRequest
