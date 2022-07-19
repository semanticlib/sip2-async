// Requests
import LoginRequest from './lib/requests/Login.js'
import SCStatusRequest from './lib/requests/SCStatus.js'
import RequestResendRequest from './lib/requests/RequestResend.js'
import PatronStatusRequest from './lib/requests/PatronStatus.js'
import PatronInformationRequest from './lib/requests/PatronInformation.js'
import BlockPatronRequest from './lib/requests/BlockPatron.js'
import PatronEnableRequest from './lib/requests/PatronEnable.js'
import ItemInformationRequest from './lib/requests/ItemInformation.js'
import CheckoutRequest from './lib/requests/Checkout.js'
import CheckinRequest from './lib/requests/Checkin.js'
import RenewRequest from './lib/requests/Renew.js'
import RenewAllRequest from './lib/requests/RenewAll.js'
import FeePaidRequest from './lib/requests/FeePaid.js'
import EndPatronSessionRequest from './lib/requests/EndPatronSession.js'
import HoldRequest from './lib/requests/Hold.js'
import Client from './lib/Client.js'

const SIP2 = {
  Client,
  LoginRequest,
  SCStatusRequest,
  RequestResendRequest,
  PatronStatusRequest,
  PatronInformationRequest,
  BlockPatronRequest,
  PatronEnableRequest,
  ItemInformationRequest,
  CheckoutRequest,
  CheckinRequest,
  RenewRequest,
  RenewAllRequest,
  FeePaidRequest,
  EndPatronSessionRequest,
  HoldRequest
}

export default SIP2
