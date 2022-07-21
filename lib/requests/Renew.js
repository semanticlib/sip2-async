import RequestMessage from '../RequestMessage.js'

class RenewRequest extends RequestMessage {
  constructor (itemIdentifier, nbDueDate, itemProperties, feeAcknowledged, noBlock = false) {
    super('29')

    this.sequence = 2
    this.thirdParty = false
    this.noBlock = noBlock // no block means date in nbDueDate was given as duedate while in offline mode and ils shall accept that/no block
    this.nbDueDate = nbDueDate || RequestMessage.getDateTime() // to be ignored since noBlock is false by default
    this.itemIdentifier = itemIdentifier
    this.itemProperties = itemProperties || ''
    this.feeAcknowledged = feeAcknowledged || null
    this.transactionDate = RequestMessage.getDateTime()
  }

  buildMessage () {
    this.append(this.thirdParty ? 'Y' : 'N')
    this.append(this.noBlock ? 'Y' : 'N')
    this.append(this.transactionDate)
    this.append(this.nbDueDate)
    this.append('AO')
    this.append(this.institutionId)
    this.append('|AA')
    this.append(this.patronIdentifier)
    if (this.patronPassword) {
      this.append('|AD')
      this.append(this.patronPassword)
    }
    this.append('|AB')
    this.append(this.itemIdentifier)
    if (this.terminalPassword) {
      this.append('|AC')
      this.append(this.terminalPassword)
    }
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

export default RenewRequest

/*
29
<third party allowed>   1-char, fixed-length required field: Y or N.
<no block>              1-char, fixed-length required field: Y or N.
<transaction date>      18-char, fixed-length required field: YYYYMMDDZZZZHHMMSS
<nb due date>           18-char, fixed-length required field: YYYYMMDDZZZZHHMMSS
<AO institution id>     variable-length required field
<AA patron identifier>  variable-length required field
<AD patron password>    variable-length optional field
<AB item identifier>    variable-length optional field
<AJ title identifier>   variable-length optional field
<AC terminal password>  variable-length optional field
<CH item properties>    variable-length optional field
<BO fee acknowledged>   1-char, optional field: Y or N
 */
