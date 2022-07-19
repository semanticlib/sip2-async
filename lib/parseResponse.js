import ResponseParser from './ResponseParser.js'

function parse (payload) {
  if (payload.message === null) {
    throw new Error('Invalid SIP2 response: response is null.')
  }

  if (payload.message.length < 2) {
    throw new Error('Invalid SIP2 response: response message is too short.')
  }

  payload.identifier = payload.message.substring(0, 2)
  const parser = new ResponseParser(payload)
  switch (payload.identifier) {
    case '94':
      return parser.LoginResponse()

    case '98':
      return parser.ACSStatusResponse()

    case '24': // patron status
      return parser.PatronResponse()

    case '26': // patron enable
      return parser.PatronResponse()

    case '64': // patron info
      return parser.PatronResponse()

    case '18':
      return parser.ItemInformation()

    case '10': // checkin
      return parser.TransactionResponse()

    case '12': // checkout
      return parser.TransactionResponse()

    case '30': // renew
      return parser.TransactionResponse()

    case '66':
      return parser.RenewAll()

    case '16':
      return parser.HoldResponse()

    case '38': // fee paid
      return parser.FeePaidOrSession()

    case '36': // end session
      return parser.FeePaidOrSession()

    default:
      throw new Error(`Unsupported identifier: ${payload.identifier}`)
  }
}

export default parse
