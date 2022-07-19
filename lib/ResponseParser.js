import DataTypes from './DataTypes.js'
import utils from './ResponseUtils.js'
import date from 'date-and-time'

class ResponseParser {
  constructor (payload) {
    this.message = payload.message
    this.responseCode = parseInt(payload.identifier)
    this.tzOffset = payload.tzOffset
    this.dueDateFormat = payload.dueDateFormat
    this.verbose = payload.verbose
  }

  LoginResponse () {
    return {
      ok: utils.intToBool(this.message.charAt(2))
    }
  }

  ACSStatusResponse () {
    const data = {}
    data.onLineStatus = utils.charToBool(this.message.charAt(2))
    data.checkinOk = utils.charToBool(this.message.charAt(3))
    data.checkoutOk = utils.charToBool(this.message.charAt(4))
    data.ACSRenewalPolicy = utils.charToBool(this.message.charAt(5))
    data.statusUpdateOk = utils.charToBool(this.message.charAt(6))
    data.offLineOk = utils.charToBool(this.message.charAt(7))
    data.timeoutPeriod = utils.stringToInt(this.message.substring(8, 11))
    data.retriesAllowed = utils.stringToInt(this.message.substring(11, 14))
    data.dateTimeSync = this.#parseDateTime(this.message.substring(14, 32))
    data.protocolVersion = this.message.substring(32, 36)
    data.institutionId = utils.parseFirstVariable('AO', this.message.substring(36))
    data.libraryName = utils.parseVariable('AM', this.message.substring(36))
    data.supportedMessages = utils.parseVariable('BX', this.message.substring(36))
      ? this.#parseSupportedMessages()
      : {}
    data.terminalLocation = utils.parseVariable('AN', this.message.substring(36))

    return Object.assign({}, data, this.#parseCommonValues())
  }

  ItemInformation () {
    const data = {}
    data.status = DataTypes.circStatus[this.message.substring(2, 4)] || null
    if (this.verbose) {
      data.securityMarker = DataTypes.securityMarker[this.message.substring(4, 6)] || null
      data.feeType = DataTypes.feeType[this.message.substring(6, 8)] || null
    }
    data.transactionDate = this.#parseDateTime(this.message.substring(8, 26))

    const payload = this.message.substring(26)
    data.itemId = utils.parseFirstVariable('AB', payload)
    data.title = utils.parseVariable('AJ', payload)
    if (utils.existsAndNotEmpty('CK', payload)) {
      data.mediaType = DataTypes.mediaType[utils.parseVariable('CK', payload)] || null
    }
    data.holdQueueLength = utils.parseFirstVariable('CF', payload)
    data.dueDate = this.#formatDueDate(utils.parseFirstVariable('AH', payload))
    data.recallDate = utils.parseFirstVariable('CJ', payload)
    data.holdPickupDate = utils.parseFirstVariable('CM', payload)

    // Location fields
    if (utils.existsAndNotEmpty('BG', payload)) {
      data.owningLocation = utils.parseVariable('BG', payload)
    }
    data.permanentLocation = utils.parseVariable('AQ', payload)
    data.currentLocation = utils.parseVariable('AP', payload)
    if (this.verbose) {
      data.itemProperties = utils.parseVariable('CH', payload)
    }

    return Object.assign({}, data, this.#parseCommonValues())
  }

  PatronResponse () {
    const dataPosition = this.responseCode === 64 ? 61 : 37
    const data = {}
    data.blocks = this.#parsePatronBlocks()
    data.language = DataTypes.language[this.message.substring(16, 19)]
    data.transactionDate = this.#parseDateTime(this.message.substring(19, 37))

    const payload = this.message.substring(dataPosition)
    data.institutionId = utils.parseFirstVariable('AO', payload)
    data.patronId = utils.parseVariable('AA', payload)
    data.fullName = utils.parseVariable('AE', payload) || utils.parseFirstVariable('AE', payload)

    if (this.responseCode === 64) { // patron information
      data.summaryCount = {
        hold: utils.stringToInt(this.message.substring(37, 41)),
        overdue: utils.stringToInt(this.message.substring(41, 45)),
        charged: utils.stringToInt(this.message.substring(45, 49)),
        fine: utils.stringToInt(this.message.substring(49, 53)),
        recall: utils.stringToInt(this.message.substring(53, 57)),
        unavailableHold: utils.stringToInt(this.message.substring(57, 61))
      }
      data.limits = {}
      if (utils.exists('BZ', payload)) {
        const temp = utils.parseVariable('BZ', payload)
        data.limits.holdItemsLimit = utils.stringToInt(temp)
      }
      if (utils.exists('CA', payload)) {
        const temp = utils.parseVariable('CA', payload)
        data.limits.overdueItemsLimit = utils.stringToInt(temp)
      }
      if (utils.exists('CB', payload)) {
        const temp = utils.parseVariable('CB', payload)
        data.limits.chargedItemsLimit = utils.stringToInt(temp)
      }
      if (utils.exists('CC', payload)) {
        data.limits.feeLimit = utils.parseVariable('CC', payload)
      }
      Object.keys(DataTypes.itemType).forEach(code => {
        const items = utils.parseVariableMulti(code, payload)
        if (items && items.length > 0) {
          data.items = items
          data.itemType = DataTypes.itemType[code]
        }
      })
    }

    if (utils.existsAndNotEmpty('BL', payload)) {
      const temp = utils.parseVariable('BL', payload)
      data.validPatron = utils.charToBool(temp.charAt(0))
    }
    if (utils.existsAndNotEmpty('CQ', payload)) {
      const temp = utils.parseVariable('CQ', payload)
      data.validPatronPassword = utils.charToBool(temp.charAt(0))
    }
    if (utils.existsAndNotEmpty('BH', payload)) {
      data.currency = utils.parseVariable('BH', payload)
    }
    data.feeAmount = utils.parseVariable('BV', payload)

    if (this.verbose) {
      data.homeAddress = utils.parseVariable('BD', payload)
    }
    data.email = utils.parseVariable('BE', payload)
    data.phone = utils.parseVariable('BF', payload)

    return Object.assign({}, data, this.#parseCommonValues())
  }

  TransactionResponse () {
    const data = {}
    data.ok = utils.intToBool(this.message.charAt(2))
    data.renewalOk = utils.charToBool(this.message.charAt(3))
    if (this.verbose) {
      if (['U', 'N'].indexOf(this.message.charAt(4)) > -1) {
        data.magneticMediaSupported = false
        data.magneticMedia = false
      } else {
        data.magneticMediaSupported = true
        data.megnaticMedia = utils.charToBool(this.message.charAt(4))
      }
    }
    if (this.verbose && (this.responseCode === 12 || this.responseCode === 30)) { // checkout or renew
      if (['U', 'N'].indexOf(this.message.charAt(5)) > -1) {
        data.desensitizeSupported = false
        data.desensitize = false
      } else {
        data.desensitizeSupported = false
        data.desensitize = utils.charToBool(this.message.charAt(5))
      }
    }
    if (this.responseCode === 10) { // checkin
      data.alert = utils.charToBool(this.message.charAt(5))
    }

    data.transactionDate = this.#parseDateTime(this.message.substring(6, 24))

    const payload = this.message.substring(24)
    data.institutionId = utils.parseFirstVariable('AO', payload)
    data.patronId = utils.parseVariable('AA', payload)
    data.itemId = utils.parseVariable('AB', payload)
    data.title = utils.parseVariable('AJ', payload)
    if (utils.existsAndNotEmpty('AH', payload)) {
      data.dueDate = this.#formatDueDate(utils.parseVariable('AH', payload))
    }
    if (utils.existsAndNotEmpty('CK', payload)) {
      data.mediaType = DataTypes.mediaType[utils.parseVariable('CK', payload)]
    }
    if (this.verbose && utils.existsAndNotEmpty('CL', payload)) {
      data.sortBin = utils.parseVariable('CL', payload)
    }
    if (this.verbose) {
      data.itemProperties = utils.parseVariable('CH', payload)
    }
    if (this.verbose && utils.existsAndNotEmpty('BK', payload)) {
      data.transactionId = utils.parseVariable('BK', payload)
    }
    if (utils.existsAndNotEmpty('BV', payload)) {
      data.feeAmount = utils.parseVariable('BV', payload)
    }

    return Object.assign({}, data, this.#parseCommonValues())
  }

  RenewAll () {
    const data = {}
    data.ok = utils.intToBool(this.message.charAt(2))
    data.renewedCount = utils.stringToInt(this.message.substring(3, 7))
    data.not_renewedCount = utils.stringToInt(this.message.substring(7, 11))
    data.transactionDate = this.#parseDateTime(this.message.substring(11, 29))
    data.institutionId = utils.parseFirstVariable('AO', this.message.substring(29))

    Object.keys(DataTypes.renewList).forEach(code => {
      const itemType = DataTypes.renewList[code]
      const items = utils.parseVariableMulti(code, this.message.substring(29))
      if (items && items.length > 0) {
        data[itemType] = {}
        data[itemType].items = items
      }
    })

    return Object.assign({}, data, this.#parseCommonValues())
  }

  HoldResponse () {
    const data = {}

    data.ok = utils.intToBool(this.message.charAt(2))
    data.available = utils.charToBool(this.message.charAt(3))
    data.transactionDate = this.#parseDateTime(this.message.substring(4, 22))

    const payload = this.message.substring(22)
    data.expirationDate = utils.parseFirstVariable('BW', payload)
    data.queuePosition = utils.parseVariable('BR', payload)
    data.pickupLocation = utils.parseVariable('BS', payload)
    data.institutionId = utils.parseVariable('AO', payload)
    data.patronId = utils.parseVariable('AA', payload) || utils.parseFirstVariable('AA', payload)
    data.itemId = utils.parseVariable('AB', payload)
    data.title = utils.parseVariable('AJ', payload)

    return Object.assign({}, data, this.#parseCommonValues())
  }

  FeePaidOrSession () {
    const payload = this.message.substring(21)

    const data = {}
    if (this.responseCode === 36) {
      data.endSession = utils.charToBool(this.message.charAt(2))
    }
    if (this.responseCode === 38) {
      data.paymentAccepted = utils.charToBool(this.message.charAt(2))
    }

    data.transactionDate = this.#parseDateTime(this.message.substring(3, 21))
    data.institutionId = utils.parseFirstVariable('AO', payload)
    data.patronId = utils.parseVariable('AA', payload)
    if (utils.existsAndNotEmpty('BK', payload)) {
      data.transactionId = utils.parseVariable('BK', payload)
    }

    return Object.assign({}, data, this.#parseCommonValues())
  }

  // Private methods
  #parseDateTime (dateStr) {
    return date.parse(`${dateStr}${this.tzOffset}`, 'YYYYMMDD    HHmmssZ')
  }

  #formatDueDate (dateStr) {
    return date.isValid(`${dateStr}${this.tzOffset}`, `${this.dueDateFormat}Z`)
      ? date.parse(`${dateStr}${this.tzOffset}`, `${this.dueDateFormat}Z`)
      : dateStr
  }

  #parseSupportedMessages () {
    const payload = utils.parseVariable('BX', this.message.substring(36))
    const messages = {}
    messages.patronStatusRequest = utils.charToBool(payload.charAt(0))
    messages.checkout = utils.charToBool(payload.charAt(1))
    messages.checkin = utils.charToBool(payload.charAt(2))
    messages.blockPatron = utils.charToBool(payload.charAt(3))
    messages.SCACSStatus = utils.charToBool(payload.charAt(4))
    messages.requestSCACSResend = utils.charToBool(payload.charAt(5))
    messages.login = utils.charToBool(payload.charAt(6))
    messages.patronInformation = utils.charToBool(payload.charAt(7))
    messages.endPatronSession = utils.charToBool(payload.charAt(8))
    messages.feePaid = utils.charToBool(payload.charAt(9))
    messages.itemInformation = utils.charToBool(payload.charAt(10))
    messages.itemStatusUpdate = utils.charToBool(payload.charAt(11))
    messages.patronEnable = utils.charToBool(payload.charAt(12))
    messages.hold = utils.charToBool(payload.charAt(13))
    messages.renew = utils.charToBool(payload.charAt(14))
    messages.renewAll = utils.charToBool(payload.charAt(15))
    return messages
  }

  #parsePatronBlocks () {
    const status = {}
    status.chargePrivilegesDenied = utils.charEmptyToBool(this.message.charAt(2))
    status.renewalPrivilegedDenied = utils.charEmptyToBool(this.message.charAt(3))
    status.recallPrivilegesDenied = utils.charEmptyToBool(this.message.charAt(4))
    status.holdPrivilegesDenied = utils.charEmptyToBool(this.message.charAt(5))
    status.cardReportedLost = utils.charEmptyToBool(this.message.charAt(6))
    status.tooManyItemsCharged = utils.charEmptyToBool(this.message.charAt(7))
    status.tooManyItemsOverdue = utils.charEmptyToBool(this.message.charAt(8))
    status.tooManyRenewals = utils.charEmptyToBool(this.message.charAt(9))
    status.tooManyClaimsOfItemsReturned = utils.charEmptyToBool(this.message.charAt(10))
    status.tooManyItemsLost = utils.charEmptyToBool(this.message.charAt(11))
    status.excessiveOutstandingFines = utils.charEmptyToBool(this.message.charAt(12))
    status.excessiveOutstandingFees = utils.charEmptyToBool(this.message.charAt(13))
    status.recallOverdue = utils.charEmptyToBool(this.message.charAt(14))
    status.tooManyItemsBilled = utils.charEmptyToBool(this.message.charAt(15))
    const blocks = []
    Object.entries(status).forEach(x => {
      if (x[1] !== false) blocks.push(x[0])
    })
    return blocks
  }

  #parseCommonValues () {
    const data = {}
    data.screenMessage = utils.parseVariableMulti('AF', this.message)
    data.printLine = utils.parseVariableMulti('AG', this.message)
    if (this.verbose && utils.getSequence(this.message) !== '') {
      data.sequence = parseInt(utils.getSequence(this.message), 10)
      data.checksum = utils.getChecksum(this.message)
    }
    return data
  }
}

export default ResponseParser
