import assert from 'assert'
import parseResponse from '../lib/parseResponse.js'

describe('LoginResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 login message', (done) => {
      const testResponse = '941AY3AZFDFA'
      const response = parseResponse({ message: testResponse })
      assert.equal(response.ok, true)
      done()
    })
  })
})

describe('ACStatusResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 AC status message', (done) => {
      const testResponse = '98YYYYNN10000520220721    2130422.00AONEX|BXYYYYYYYYYYYNYYYY|AY2AZEE74'
      const response = parseResponse({ message: testResponse, tzOffset: '+0000', verbose: true })

      assert.equal(response.onLineStatus, true)
      assert.equal(response.checkinOk, true)
      assert.equal(response.checkoutOk, true)
      assert.equal(response.ACSRenewalPolicy, true)
      assert.equal(response.statusUpdateOk, false)
      assert.equal(response.offLineOk, false)
      assert.equal(response.timeoutPeriod, 100)
      assert.equal(response.retriesAllowed, 5)
      assert.equal(response.dateTimeSync.toLocaleString('en-US', { timeZone: 'UTC' }), '7/21/2022, 9:30:42 PM')
      assert.equal(response.protocolVersion, '2.00')
      assert.equal(response.institutionId, 'NEX')
      assert.equal(response.libraryName, null)

      assert.equal(response.supportedMessages.patronStatusRequest, true)
      assert.equal(response.supportedMessages.checkout, true)
      assert.equal(response.supportedMessages.checkin, true)
      assert.equal(response.supportedMessages.blockPatron, true)
      assert.equal(response.supportedMessages.SCACSStatus, true)
      assert.equal(response.supportedMessages.requestSCACSResend, true)
      assert.equal(response.supportedMessages.login, true)
      assert.equal(response.supportedMessages.patronInformation, true)
      assert.equal(response.supportedMessages.endPatronSession, true)
      assert.equal(response.supportedMessages.feePaid, true)
      assert.equal(response.supportedMessages.itemInformation, true)
      assert.equal(response.supportedMessages.itemStatusUpdate, false)
      assert.equal(response.supportedMessages.patronEnable, true)
      assert.equal(response.supportedMessages.hold, true)
      assert.equal(response.supportedMessages.renew, true)
      assert.equal(response.supportedMessages.renewAll, true)

      assert.equal(response.terminalLocation, null)
      assert.equal(response.screenMessage, null)
      assert.equal(response.printLine, null)
      assert.equal(response.sequence, 2)
      assert.equal(response.checksum, 'EE74')

      done()
    })
  })
})

describe('PatronStatusResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 patron status message', (done) => {
      const testResponse = '24              00119960212    100239AO|AA104000000105|AEJohn Doe|AFScreen Message|AGCheck Print message|AY2AZDFC4'
      const response = parseResponse({ message: testResponse, tzOffset: '+0000', verbose: true })

      // Patron status
      assert.equal(response.blocks.indexOf(0) === -1, true)
      assert.equal(response.status.chargePrivilegesDenied, false)
      assert.equal(response.status.renewalPrivilegesDenied, false)
      assert.equal(response.status.recallPrivilegesDenied, false)
      assert.equal(response.status.holdPrivilegesDenied, false)
      assert.equal(response.status.cardReportedLost, false)
      assert.equal(response.status.tooManyItemsCharged, false)
      assert.equal(response.status.tooManyItemsOverdue, false)
      assert.equal(response.status.tooManyRenewals, false)
      assert.equal(response.status.tooManyClaimsOfItemsReturned, false)
      assert.equal(response.status.tooManyItemsLost, false)
      assert.equal(response.status.excessiveOutstandingFines, false)
      assert.equal(response.status.excessiveOutstandingFees, false)
      assert.equal(response.status.recallOverdue, false)
      assert.equal(response.status.tooManyItemsBilled, false)

      assert.equal(response.language, 'English')
      assert.equal(response.transactionDate.toLocaleString('en-US', { timeZone: 'UTC' }), '2/12/1996, 10:02:39 AM')
      assert.equal(response.patronId, '104000000105')
      assert.equal(response.fullName, 'John Doe')
      assert.equal(response.feeAmount, null)
      assert.equal(response.homeAddress, null)
      assert.equal(response.phone, null)
      assert.equal(response.screenMessage.indexOf('Screen Message') > -1, true)
      assert.equal(response.printLine.indexOf('Check Print message') > -1, true)
      assert.equal(response.sequence, 2)
      assert.equal(response.checksum, 'DFC4')

      done()
    })
  })
})

describe('PatronInformationResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 patron information message', (done) => {
      const testResponse = '64              00119980723    104009000100000002000100020000AOInstitutionID for PatronID|AAPatronID|AEPatron Name|BZ0002|CA0003|CB0010|BLY|ASItemID1 for PatronID|AUChargeItem1|AUChargeItem2|BDHome Address|BEE Mail Address|BFHome Phone for PatronID|AFScreenMessage 0 for PatronID, Language 1|AFScreen Message 1 for PatronID, Language 1|AFScreen Message 2 for PatronID, Language 1|AGPrint Line 0 for PatronID, Language 1|AGPrint Line 1 for PatronID, Language 1|AGPrint Line 2 for PatronID, language 1|AY4AZ608F'
      const response = parseResponse({ message: testResponse, tzOffset: '+0000', verbose: true })

      // Patron status
      assert.equal(response.blocks.indexOf(0) === -1, true)
      assert.equal(response.status.chargePrivilegesDenied, false)
      assert.equal(response.status.renewalPrivilegesDenied, false)
      assert.equal(response.status.recallPrivilegesDenied, false)
      assert.equal(response.status.holdPrivilegesDenied, false)
      assert.equal(response.status.cardReportedLost, false)
      assert.equal(response.status.tooManyItemsCharged, false)
      assert.equal(response.status.tooManyItemsOverdue, false)
      assert.equal(response.status.tooManyRenewals, false)
      assert.equal(response.status.tooManyClaimsOfItemsReturned, false)
      assert.equal(response.status.tooManyItemsLost, false)
      assert.equal(response.status.excessiveOutstandingFines, false)
      assert.equal(response.status.excessiveOutstandingFees, false)
      assert.equal(response.status.recallOverdue, false)
      assert.equal(response.status.tooManyItemsBilled, false)

      assert.equal(response.language, 'English')
      assert.equal(response.transactionDate.toLocaleString('en-US', { timeZone: 'UTC' }), '7/23/1998, 10:40:09 AM')
      assert.equal(response.summaryCount.hold, 1)
      assert.equal(response.summaryCount.overdue, 0)
      assert.equal(response.summaryCount.charged, 2)
      assert.equal(response.summaryCount.fine, 1)
      assert.equal(response.summaryCount.recall, 2)
      assert.equal(response.summaryCount.unavailableHold, 0)

      assert.equal(response.patronId, 'PatronID')
      assert.equal(response.fullName, 'Patron Name')
      assert.equal(response.validPatron, true)

      assert.equal(response.limits.holdItemsLimit, 2)
      assert.equal(response.limits.overdueItemsLimit, 3)
      assert.equal(response.limits.chargedItemsLimit, 10)

      assert.equal(response.feeAmount, null)
      assert.equal(response.feeLimit, null)
      assert.equal(response.items.length, 2)
      assert.equal(response.items.indexOf('ChargeItem1') > -1, true)
      assert.equal(response.items.indexOf('ChargeItem2') > -1, true)
      assert.equal(response.itemType, 'charged')

      assert.equal(response.homeAddress, 'Home Address')
      assert.equal(response.email, 'E Mail Address')
      assert.equal(response.phone, 'Home Phone for PatronID')

      assert.equal(response.screenMessage.indexOf('ScreenMessage 0 for PatronID, Language 1') > -1, true)
      assert.equal(response.screenMessage.length === 3, true)
      assert.equal(response.printLine.indexOf('Print Line 0 for PatronID, Language 1') > -1, true)
      assert.equal(response.printLine.length === 3, true)
      assert.equal(response.sequence, 4)
      assert.equal(response.checksum, '608F')

      done()
    })
  })
})

describe('PatronEnableResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 patron enable response message', (done) => {
      const testResponse = '26              00119980723    111413AOInstitutionID for PatronID|AAPatronID|AEPatron Name|BLY|AFScreenMessage 0 for PatronID, Language 1|AFScreen Message 1 for PatronID, Language 1|AGPrint Line 0 for PatronID, Language 1|AY7AZ8EA6'
      const response = parseResponse({ message: testResponse, tzOffset: '+0000', verbose: true })

      // Patron status
      assert.equal(response.status.chargePrivilegesDenied, false)
      assert.equal(response.status.renewalPrivilegesDenied, false)
      assert.equal(response.status.recallPrivilegesDenied, false)
      assert.equal(response.status.holdPrivilegesDenied, false)
      assert.equal(response.status.cardReportedLost, false)
      assert.equal(response.status.tooManyItemsCharged, false)
      assert.equal(response.status.tooManyItemsOverdue, false)
      assert.equal(response.status.tooManyRenewals, false)
      assert.equal(response.status.tooManyClaimsOfItemsReturned, false)
      assert.equal(response.status.tooManyItemsLost, false)
      assert.equal(response.status.excessiveOutstandingFines, false)
      assert.equal(response.status.excessiveOutstandingFees, false)
      assert.equal(response.status.recallOverdue, false)
      assert.equal(response.status.tooManyItemsBilled, false)

      assert.equal(response.language, 'English')
      assert.equal(response.transactionDate.toLocaleString('en-US', { timeZone: 'UTC' }), '7/23/1998, 11:14:13 AM')
      assert.equal(response.patronId, 'PatronID')
      assert.equal(response.fullName, 'Patron Name')
      assert.equal(response.feeAmount, null)
      assert.equal(response.screenMessage.indexOf('Screen Message 1 for PatronID, Language 1') > -1, true)
      assert.equal(response.printLine.indexOf('Print Line 0 for PatronID, Language 1') > -1, true)
      assert.equal(response.sequence, 7)
      assert.equal(response.checksum, '8EA6')

      done()
    })
  })
})

describe('ItemInformationResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 item information response message', (done) => {
      const testResponse = '1808000119980723    115615CF00000|ABItemBook|AJTitle For Item Book|CK003|AQPermanent Location for ItemBook, Language 1|APCurrent Location ItemBook|CHFree-form text with new item property|AY0AZC05B'
      const response = parseResponse({
        message: testResponse,
        tzOffset: '+0000',
        dueDateFormat: 'YYYYMMDD...',
        verbose: true
      })

      assert.equal(response.status, 'Waiting On Hold Shelf')
      assert.equal(response.securityMarker, 'Other')
      assert.equal(response.feeType, 'Other Unknown')
      assert.equal(response.transactionDate.toLocaleString('en-US', { timeZone: 'UTC' }), '7/23/1998, 11:56:15 AM')

      assert.equal(response.holdQueueLength, '00000')
      assert.equal(response.dueDate, null)
      assert.equal(response.recallDate, null)
      assert.equal(response.holdPickupDate, null)

      assert.equal(response.itemId, 'ItemBook')
      assert.equal(response.title, 'Title For Item Book')

      assert.equal(response.permanentLocation, 'Permanent Location for ItemBook, Language 1')
      assert.equal(response.currentLocation, 'Current Location ItemBook')
      assert.equal(response.itemProperties, 'Free-form text with new item property')

      assert.equal(response.screenMessage, null)
      assert.equal(response.printLine, null)
      assert.equal(response.sequence, 0)
      assert.equal(response.checksum, 'C05B')

      done()
    })
  })
})

describe('CheckoutResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 checkout response message', (done) => {
      const testResponse = '121NNY20220721    223455AO|AA104000000105|AB000000000005792|AJ|AH20220801    235900|AFItem cannot be charged : see help desk|AGItem can not be charged : see help desk|AY3AZCF7E'
      const response = parseResponse({
        message: testResponse,
        tzOffset: '+0000',
        dueDateFormat: 'YYYYMMDD...',
        verbose: true
      })

      assert.equal(response.ok, true)
      assert.equal(response.renewalOk, false)
      assert.equal(response.magneticMediaSupported, false)
      assert.equal(response.magneticMedia, false)
      assert.equal(response.desensitizeSupported, false)
      assert.equal(response.desensitize, true)
      assert.equal(response.transactionDate.toLocaleString('en-US', { timeZone: 'UTC' }), '7/21/2022, 10:34:55 PM')
      assert.equal(response.institutionId, '')
      assert.equal(response.patronId, '104000000105')
      assert.equal(response.itemId, '000000000005792')
      assert.equal(response.title, '')
      assert.equal(response.dueDate.toLocaleString('en-US', { timeZone: 'UTC' }), '8/1/2022, 12:00:00 AM')
      assert.equal(response.itemProperties, null)
      // assert.equal(response.feeAmount, null)

      assert.equal(response.screenMessage.indexOf('Item cannot be charged : see help desk') > -1, true)
      assert.equal(response.printLine.indexOf('Item can not be charged : see help desk') > -1, true)
      assert.equal(response.sequence, 3)
      assert.equal(response.checksum, 'CF7E')

      done()
    })
  })
})

describe('CheckinResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 checkin response message', (done) => {
      const testResponse = '101YNN19980821    085721AOCertification Institute ID|ABCheckInBook|AQPermanent Location for CheckinBook, Language 1|AJTitle For CheckinBook|AAGoodPatron1|CK001|CHCheckinBook Properties|CLsort bin A1|AFScreen Message for CheckInBook|AGPrint Line for CheckInBook|AY2AZA3FF'
      const response = parseResponse({
        message: testResponse,
        tzOffset: '+0000',
        dueDateFormat: 'YYYYMMDD...',
        verbose: true
      })

      assert.equal(response.ok, true)
      assert.equal(response.renewalOk, true)
      assert.equal(response.magneticMediaSupported, false)
      assert.equal(response.magneticMedia, false)
      assert.equal(response.transactionDate.toLocaleString('en-US', { timeZone: 'UTC' }), '8/21/1998, 8:57:21 AM')
      assert.equal(response.institutionId, 'Certification Institute ID')
      assert.equal(response.patronId, 'GoodPatron1')
      assert.equal(response.itemId, 'CheckInBook')
      assert.equal(response.title, 'Title For CheckinBook')
      assert.equal(response.mediaType, 'Book')
      assert.equal(response.sortBin, 'sort bin A1')
      assert.equal(response.itemProperties, 'CheckinBook Properties')
      assert.equal(response.transactionId, null)
      // assert.equal(response.dueDate, null)
      // assert.equal(response.feeAmount, null)

      assert.equal(response.screenMessage.indexOf('Screen Message for CheckInBook') > -1, true)
      assert.equal(response.printLine.indexOf('Print Line for CheckInBook') > -1, true)
      assert.equal(response.sequence, 2)
      assert.equal(response.checksum, 'A3FF')

      done()
    })
  })
})

describe('FeePaidResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 fee paid response message', (done) => {
      const testResponse = '38Y19980723    111035AOInstitutionID for PatronID|AAPatronID|AFScreenMessage 0 for PatronID, Language 1|AGPrint Line 0 for PatronID, Language 1|AY6AZ9716'
      const response = parseResponse({ message: testResponse, tzOffset: '+0000', verbose: true })

      assert.equal(response.paymentAccepted, true)
      assert.equal(response.transactionDate.toLocaleString('en-US', { timeZone: 'UTC' }), '7/23/1998, 11:10:35 AM')
      assert.equal(response.institutionId, 'InstitutionID for PatronID')
      assert.equal(response.patronId, 'PatronID')

      assert.equal(response.screenMessage.indexOf('ScreenMessage 0 for PatronID, Language 1') > -1, true)
      assert.equal(response.printLine.indexOf('Print Line 0 for PatronID, Language 1') > -1, true)
      assert.equal(response.sequence, 6)
      assert.equal(response.checksum, '9716')

      done()
    })
  })
})

describe('EndSessionResponse', () => {
  describe('#parse', () => {
    it('should parse a SIP2 end session response message', (done) => {
      const testResponse = '36Y19980723    110658AOInstitutionID for PatronID|AAPatronID|AFScreenMessage 0 for PatronID, Language 1|AFScreen Message 1 for PatronID, Language 1|AFScreen Message 2 for PatronID, Language 1|AGPrint Line 0 for PatronID, Language 1|AGPrint Line 1 for PatronID, Language 1|AGPrint Line 2 for PatronID, language 1|AY5AZ970F'
      const response = parseResponse({ message: testResponse, tzOffset: '+0000', verbose: true })

      assert.equal(response.endSession, true)
      assert.equal(response.transactionDate.toLocaleString('en-US', { timeZone: 'UTC' }), '7/23/1998, 11:06:58 AM')
      assert.equal(response.institutionId, 'InstitutionID for PatronID')
      assert.equal(response.patronId, 'PatronID')

      assert.equal(response.screenMessage.length, 3)
      assert.equal(response.screenMessage.indexOf('ScreenMessage 0 for PatronID, Language 1') > -1, true)
      assert.equal(response.printLine.length, 3)
      assert.equal(response.printLine.indexOf('Print Line 0 for PatronID, Language 1') > -1, true)
      assert.equal(response.sequence, 5)
      assert.equal(response.checksum, '970F')

      done()
    })
  })
})
