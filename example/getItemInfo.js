import SIP2 from '../index.js'
// import SIP2 from 'sip2-async' // set "type": "module" in the package.json

const sipUser = ''
const sipPass = ''
const sipInst = ''
const itemId = ''

// Default options
const options = {
  host: 'localhost',
  port: 6001,
  timezoneOffset: '+0000',  // server timezone, useful if logs need to be saved
  dueDateFormat: 'YYYYMMDD', // format returned by the server
  terminator: 'CR', // response is empty if set incorrectly, use 'CRLF' for Koha
  verbose: false, // set it to true to get all the fields in response
  debug: false  // set it to true to get request and response messages in 'debugData{}'
}

const socket = new SIP2.Client(options)
await socket.connect()

// Login
const loginRequest = new SIP2.LoginRequest(sipUser, sipPass, sipInst)
loginRequest.sequence = 1 // optional, default: 1
const loginResponse = await socket.send(loginRequest.getMessage())

// Item Information
if (!loginResponse.ok) {
  console.log('SIP2 login failed')
} else {
  const itemRequest = new SIP2.ItemInformationRequest(itemId)
  itemRequest.sequence = 2 // optional, default: 2
  itemRequest.institutionId = sipInst
  const itemResponse = await socket.send(itemRequest.getMessage())
  socket.close()
  console.log(itemResponse)
}
