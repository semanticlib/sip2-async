import assert from 'assert'

// Messages
import Message from '../lib/RequestMessage.js'
import Login from '../lib/requests/Login.js'
import SCStatus from '../lib/requests/SCStatus.js'
import RequestResend from '../lib/requests/RequestResend.js'
import PatronStatus from '../lib/requests/PatronStatus.js'
import PatronInformation from '../lib/requests/PatronInformation.js'
import BlockPatron from '../lib/requests/BlockPatron.js'
import PatronEnable from '../lib/requests/PatronEnable.js'
import ItemInformation from '../lib/requests/ItemInformation.js'
import Checkout from '../lib/requests/Checkout.js'
import Checkin from '../lib/requests/Checkin.js'
import FeePaid from '../lib/requests/FeePaid.js'
import EndPatronSession from '../lib/requests/EndPatronSession.js'
import DataTypes from '../lib/DataTypes.js'

// Variables
const FeeType = DataTypes.feeType
const PaymentType = DataTypes.PaymentType
const StatusCode = DataTypes.StatusCode

describe('LoginRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 login message', (done) => {
      const loginUserId = 'LoginUserID'
      const loginPassword = 'LoginPassword'
      const locationCode = 'LocationCode'
      const loginRequest = new Login(loginUserId, loginPassword, locationCode)
      loginRequest.sequence = 5
      const testMessage = '9300CNLoginUserID|COLoginPassword|CPLocationCode|AY5AZEC7B'
      assert.equal(loginRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('SCStatusRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 SC status message', (done) => {
      const status = StatusCode.OK
      const maxPrintWidth = '40'
      const protocolVersion = '1.00'
      const scStatusRequest = new SCStatus(status, maxPrintWidth, protocolVersion)
      scStatusRequest.sequence = 1
      const testMessage = '990401.00|AY1AZFC59'
      assert.equal(scStatusRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('RequestResendRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 request resend message', (done) => {
      const requestResendRequest = new RequestResend()
      requestResendRequest.sequence = 1
      requestResendRequest.errorDetection = false
      const testMessage = '97'
      assert.equal(requestResendRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('PatronStatusRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 patron status message', (done) => {
      const patronStatusRequest = new PatronStatus()
      patronStatusRequest.sequence = 2
      patronStatusRequest.institutionId = 'id_21'
      patronStatusRequest.patronIdentifier = '104000000105'
      patronStatusRequest.transactionDate = Message.getDateTime(new Date(1996, 1, 12, 10, 2, 39))
      const testMessage = '2300119960212    100239AOid_21|AA104000000105|AC|AD|AY2AZF271'
      assert.equal(patronStatusRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('PatronInformationRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 patron information message', (done) => {
      const type = 'hold'
      const patronInformationRequest = new PatronInformation(type, 1, 5)
      patronInformationRequest.sequence = 1
      patronInformationRequest.institutionId = 'InstitutionID'
      patronInformationRequest.patronIdentifier = 'PatronID'
      patronInformationRequest.transactionDate = Message.getDateTime(new Date(1998, 6, 23, 9, 19, 5))
      const testMessage = '6300119980723    091905Y         AOInstitutionID|AAPatronID|BP00001|BQ00005|AY1AZEA83'
      assert.equal(patronInformationRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('BlockPatronRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 block patron message', (done) => {
      const cardRetained = false
      const blockedCardResponse = 'CARD BLOCK TEST'
      const blockPatronRequest = new BlockPatron(cardRetained, blockedCardResponse)
      blockPatronRequest.patronIdentifier = '104000000705'
      blockPatronRequest.sequence = 2
      blockPatronRequest.transactionDate = Message.getDateTime(new Date(1996, 1, 13, 16, 23, 52))
      const testMessage = '01N19960213    162352AO|ALCARD BLOCK TEST|AA104000000705|AC|AY2AZF02F'
      assert.equal(blockPatronRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('PatronEnableRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 item information message', (done) => {
      const patronEnableRequest = new PatronEnable()
      patronEnableRequest.sequence = 4
      patronEnableRequest.institutionId = 'Certification Institute ID'
      patronEnableRequest.patronIdentifier = 'PatronID'
      patronEnableRequest.transactionDate = Message.getDateTime(new Date(1998, 6, 23, 9, 42, 40))
      const testMessage = '2519980723    094240AOCertification Institute ID|AAPatronID|AY4AZEBF1'
      assert.equal(patronEnableRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('ItemInformationRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 item information message', (done) => {
      const itemIdentifier = 'ItemBook'
      const itemInformationRequest = new ItemInformation(itemIdentifier)
      itemInformationRequest.sequence = 1
      itemInformationRequest.institutionId = 'Certification Institute ID'
      itemInformationRequest.transactionDate = Message.getDateTime(new Date(1998, 6, 23, 10, 0, 0))
      const testMessage = '1719980723    100000AOCertification Institute ID|ABItemBook|AY1AZEBEB'
      assert.equal(itemInformationRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('CheckoutRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 checkout message', (done) => {
      const scRenewalPolicy = true
      const nbDueDate = Message.getDateTime(new Date(1996, 1, 12, 10, 5, 14))
      const itemIdentifier = '000000000005792'
      const checkoutRequest = new Checkout(scRenewalPolicy, nbDueDate, itemIdentifier)
      checkoutRequest.patronIdentifier = '104000000105'
      checkoutRequest.sequence = 3
      checkoutRequest.transactionDate = Message.getDateTime(new Date(1996, 1, 12, 10, 5, 14))
      const testMessage = '11YN19960212    10051419960212    100514AO|AA104000000105|AB000000000005792|AC|AY3AZEDC2'
      assert.equal(checkoutRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('CheckinRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 checkin message', (done) => {
      const returnDate = null
      const location = 'Certification Terminal Location'
      const itemIdentifier = 'CheckInBook'
      const checkinRequest = new Checkin(returnDate, location, itemIdentifier)
      checkinRequest.institutionId = 'Certification Institute ID'
      checkinRequest.terminalPassword = 'TPWord'
      checkinRequest.sequence = 2
      checkinRequest.cancel = false
      checkinRequest.transactionDate = Message.getDateTime(new Date(1998, 7, 21, 8, 57, 21))
      const testMessage = '09N19980821    085721                  APCertification Terminal Location|AOCertification Institute ID|ABCheckInBook|ACTPWord|BIN|AY2AZD6A5'
      assert.equal(checkinRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('FeePaidRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 fee paid message', (done) => {
      const feeType = FeeType.OVERDUE
      const paymentType = PaymentType.VISA
      const currencyType = 'USD'
      const feeAmount = '111.11'
      const feeIdentifier = false
      const transactionId = 'TransactionID'
      const institutionId = 'Certification Institute ID'
      const patronIdentifier = 'PatronID'

      const feeTypeRequest = new FeePaid(feeType, paymentType, currencyType, feeAmount, feeIdentifier, transactionId)
      feeTypeRequest.sequence = 2
      feeTypeRequest.institutionId = institutionId
      feeTypeRequest.patronIdentifier = patronIdentifier
      feeTypeRequest.transactionDate = Message.getDateTime(new Date(2022, 6, 23, 9, 32, 11))
      const testMessage = '3720220723    0932110101USDBV111.11|AOCertification Institute ID|AAPatronID|BKTransactionID|AY2AZE207'
      assert.equal(feeTypeRequest.getMessage(), testMessage)
      done()
    })
  })
})

describe('EndPatronSessionRequest', () => {
  describe('#getMessage', () => {
    it('should build a SIP2 end patron session message', (done) => {
      const endPatronSessionRequest = new EndPatronSession()
      endPatronSessionRequest.sequence = 3
      endPatronSessionRequest.institutionId = 'Certification Institute ID'
      endPatronSessionRequest.patronIdentifier = 'PatronID'
      endPatronSessionRequest.transactionDate = Message.getDateTime(new Date(1998, 6, 23, 9, 40, 14))
      const testMessage = '3519980723    094014AOCertification Institute ID|AAPatronID|AY3AZEBF2'
      assert.equal(endPatronSessionRequest.getMessage(), testMessage)
      done()
    })
  })
})
