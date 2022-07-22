# SIP2 Async
![main](https://github.com/semanticlib/sip2-async/actions/workflows/main.yml/badge.svg)
[![NPM version](https://img.shields.io/npm/v/sip2-async.svg)](https://npmjs.org/package/sip2-async)
[![NPM downloads](https://img.shields.io/npm/dm/sip2-async.svg)](https://npmjs.org/package/sip2-async)

Promise-based SIP2 client for Node.

This is based on the [node-sip2](https://github.com/frankdsm/node-sip2) package.

## Installation

```bash
npm install sip2-async
```
or
```bash
yarn add sip2-async
```

## Example Usage

Example usage for getting Item Information:

```js
import SIP2 from 'sip2-async' // set "type": "module" in the package.json

const sipUser = ''
const sipPass = ''
const sipInst = ''
const itemId = ''

// Default options
const options = {
  host: 'localhost',
  port: 6001,
  timezoneOffset: '+0000', // set to server timezone, useful if logs need to be saved
  dueDateFormat: 'YYYYMMDD', // format returned by the server
  terminator: 'CR', // response is empty if set incorrectly, use 'CRLF' for Koha
  verbose: false, // set to true to get all the fields in response
  debug: false // set to true to get request and response messages in 'debugData{}'
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
  console.log(itemResponse)
}
socket.close()

```

## Motivation

Initial attempts to modify the `node-sip2` package was just to Promisify the responses.
However, there was a need to allow ESM import so that it could be easily modified
within the same project. Then many other changes were necessitated by the editor/linter
for syntax and code re-use.

## Features

- Promise (async/await) responses instead of callbacks.
- Response data structure simplified (titleIdentifier -> title, patronIdentifier -> patronId, etc.).
- Some fields are grouped such as `summaryCount{}` and `blocks[]` in *PatronInformation*.
- More often than not the empty fields are ignored in response payload.
- Choose suitable terminator (CR|CRLF) as per server implementation. Koha defaults to *CRLF*.
- Parse transaction date as per the timezone offset in the *Client* options.
- Use the `verbose` option to get all the fields in response payload. Default: `false`.
- Replaced `dateformat` with `date-and-time` since it can do both parsing and formatting.
- Convert the dueDate to *Date* object using the `date-and-time` package. Koha responds in *YYYYMMDD...*

## Tests

```bash
yarn install
yarn test
```
