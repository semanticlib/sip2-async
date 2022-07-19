import RequestMessage from '../RequestMessage.js'
import DataTypes from '../DataTypes.js'

function pad (num, size) {
  let s = `${num}`
  while (s.length < size) s = `0${s}`
  return s
}

function prepareSummary (type) {
  let summary = '          '
  if (Object.prototype.hasOwnProperty.call(DataTypes.SummaryPosition, type)) {
    const position = DataTypes.SummaryPosition[type]
    summary = summary.substring(0, position) + 'Y' + summary.substring(position + 1)
  }
  return summary
}

class PatronInformationRequest extends RequestMessage {
  constructor (type, startItem, endItem) {
    super('63')

    this.type = type || 'none'
    this.startItem = startItem || 1
    this.endItem = endItem || 5
    this.transactionDate = RequestMessage.getDateTime()
  }

  buildMessage () {
    this.summary = prepareSummary(this.type)

    this.append(this.language)
    this.append(this.transactionDate)
    this.append(this.summary)
    this.append('AO')
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
    if (this.startItem) {
      this.append('|BP')
      this.append(pad(this.startItem, 5))
    }
    if (this.endItem) {
      this.append('|BQ')
      this.append(pad(this.endItem, 5))
    }
  }
}

export default PatronInformationRequest
