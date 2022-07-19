class ResponseUtils {
  static parseVariable (prefix, message) {
    const regexp = new RegExp('\\|' + prefix + '(.*?)\\|')
    const matches = message.match(regexp)
    if (matches && matches.length > 1) {
      return matches[1]
    }
    return null
  }

  static parseFirstVariable (prefix, message) {
    const regexp = new RegExp(prefix + '(.*?)\\|')
    const matches = message.match(regexp)
    if (matches && matches.length > 1) {
      return matches[1]
    }
    return null
  }

  static parseVariableMulti (prefix, message) {
    const results = []
    const regexp = new RegExp('\\|(((' + prefix + '.*?)\\|)+)')
    const matches = message.match(regexp)
    if (matches && matches.length > 1) {
      const splits = matches[1].split('|')
      splits.forEach((split) => {
        if (split.substring(2)) {
          results.push(split.substring(2))
        }
      })
      return results
    }
    return null
  }

  static exists (prefix, message) {
    const regexp = new RegExp('\\|' + prefix + '(.*?)\\|')
    const matches = message.match(regexp)
    return !!(matches && matches.length > 1)
  }

  static existsAndNotEmpty (prefix, message) {
    const regexp = new RegExp('\\|' + prefix + '(.*?)\\|')
    const matches = message.match(regexp)
    return !!(matches && matches.length > 1 && matches[1])
  }

  static getSequence (message) {
    const regexp = new RegExp('\\|' + 'AY(\\d)')
    const matches = message.match(regexp)
    if (matches && matches.length > 1) {
      return matches[1]
    }
    return false
  }

  static getChecksum (message) {
    const regexp = new RegExp('\\|(AY\\d|)' + 'AZ(\\w{4})')
    const matches = message.match(regexp)
    if (matches && matches.length > 2) {
      return matches[2]
    }
    return ''
  }

  static intToBool (value) {
    if (value === '1') {
      return true
    }
    if (value === '0') {
      return false
    }
    return null
  }

  static charToBool (char) {
    if (char === 'Y') {
      return true
    }
    if (char === 'N') {
      return false
    }
    return null
  }

  static charEmptyToBool (char) {
    if (char === ' ') {
      return false
    } else if (char === 'Y') {
      return true
    }
    return null
  }

  static stringToInt (value) {
    return parseInt(value, 10)
  }
}

export default ResponseUtils
