# SIP2 Async

Promise-based SIP2 client for Node.

This is based on [node-sip2](https://github.com/frankdsm/node-sip2) package.

Tested on *Node => 16x*

## Installation

```bash
$ npm install sip2-async
```

## Example Usage

Example usage for getting Item Information:

```
import SIP2 from 'sip2-async'

const sipUser = ''
const sipPass = ''
const sipInst = ''
const itemId = ''

// Default options
const options = {
  host: 'localhost',
  port: 6001,
  timezoneOffset: '+0000',  // set it to server timezone, useful if transactions logs need to be saved
  dueDateFormat: 'YYYYMMDD', // varies in implementations, needed to convert arbitrary date string to Date() object
  terminator: 'CR', // very important, set it to 'CRLF' for Koha
  verbose: false // Keeps most useful fields in response, set it to true to get everything
}

const socket = new SIP2.Client(options)
await socket.connect()

// Login
const loginRequest = new SIP2.LoginRequest(sipUser, sipPass, sipInst)
loginRequest.sequence = 1
const loginResponse = await socket.send(loginRequest.getMessage())

// Item Information
if (!loginResponse.ok) {
  console.log('SIP2 login failed')
} else {
  const itemRequest = new SIP2.ItemInformationRequest(itemId)
  itemRequest.sequence = 2
  itemRequest.institutionId = sipInst
  const itemResponse = await socket.send(itemRequest.getMessage())
  socket.close()
  console.log(itemResponse)
}

```

## Motivation

Initial attempts to modify the `node-sip2` package was just to Promisify the responses.
However, there was a need to allow ESM import so that it could be easily modified
within the same project. Then many other changes were necessitated by the editor/linter
for syntax and code re-use.

## Features

- Promise (async/await) responses instead of callbacks.
- Response data structure simplified (titleIdentifier -> title, patronIdentifier -> patronId, etc.)
- Choose suitable terminator (CR|CRLF) as per server implementation. Koha defaults to *CRLF*.
- Parse transaction date as per the timezone offset in the *Client* options.
- Use the `verbose` option to get all the fields in response payload. Default: `false`.
- Replaced `dateformat` with `date-and-time` since it can do both parsing and formatting.
- Convert the dueDate to *Date* object using the `date-and-time` package. Koha responds in *YYYYMMDD...*


## Tests

To run the test suite, first install the dependencies then run `yarn test`:

```bash
$ yarn install
$ yarn test
```
