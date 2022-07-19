class DataTypes {
  // ===========================================
  // Request message constants [only PascalCase]
  // ===========================================
  static StatusCode = {
    OK: '0',
    PRINTER_OUT_OF_PAPER: '1',
    SHUT_DOWN: '2'
  }

  static PaymentType = {
    CASH: '00',
    VISA: '01',
    CREDIT_CARD: '02'
  }

  static FeeType = {
    OTHER_UNKNOWN: '01',
    ADMINISTRATIVE: '02',
    DAMAGE: '03',
    OVERDUE: '04',
    PROCESSING: '05',
    RENTAL: '06',
    REPLACEMENT: '07',
    COMPUTER_ACCESS_CHARGE: '08',
    HOLD_FEE: '09'
  }

  static SummaryPosition = {
    hold: 0,
    overdue: 1,
    charged: 2,
    fine: 3,
    recall: 4,
    unavailable: 5,
    fee: 6
  }

  // ===========================================
  // Response message constants [only camelCase]
  // ===========================================
  static itemType = {
    AS: 'hold',
    AT: 'overdue',
    AU: 'charged',
    AV: 'fine',
    BU: 'recall',
    CD: 'unavailable_hold'
  }

  static renewList = {
    BM: 'renewed',
    BN: 'not_renewed'
  }

  static circStatus = {
    '01': 'Invalid Or Unknown Item Id',
    '02': 'On Order',
    '03': 'Available',
    '04': 'Checked Out',
    '05': 'Checked Out, not to be Recalled',
    '06': 'In Process',
    '07': 'Recalled',
    '08': 'Waiting On Hold Shelf',
    '09': 'Waiting To Be Re-shelved',
    10: 'In Transit',
    11: 'Claimed Returned',
    12: 'Lost',
    13: 'Missing'
  }

  static securityMarker = {
    '00': 'Other',
    '01': 'None',
    '02': 'Tattle Tape Security Strip 3M',
    '03': 'Whisper Tape 3M'
  }

  static feeType = {
    '01': 'Other Unknown',
    '02': 'Administrative',
    '03': 'Damage',
    '04': 'Overdue',
    '05': 'Processing',
    '06': 'Rental',
    '07': 'Replacement',
    '08': 'Computer Access Charge',
    '09': 'Hold Fee'
  }

  static mediaType = {
    '000': 'Other',
    '001': 'Book',
    '002': 'Magazine',
    '003': 'Bound Journal',
    '004': 'Audio Tape',
    '005': 'Video Tape',
    '006': 'CD DVD',
    '007': 'Diskette',
    '008': 'Book With Diskette',
    '009': 'Book With CD',
    '010': 'Book With Audio Tape'
  }

  static language = {
    '000': 'Unknown',
    '001': 'English',
    '002': 'French',
    '003': 'German',
    '004': 'Italian',
    '005': 'Dutch',
    '006': 'Swedish',
    '007': 'Finnish',
    '008': 'Spanish',
    '009': 'Danish',
    '010': 'Portugese',
    '011': 'Canadian French',
    '012': 'Norwegian',
    '013': 'Hebrew',
    '014': 'Japanase',
    '015': 'Russian',
    '016': 'Arabic',
    '017': 'Polish',
    '018': 'Greek',
    '019': 'Chinese',
    '020': 'Korean',
    '021': 'North American Spanish',
    '022': 'Tamil',
    '023': 'Malay',
    '024': 'United Kingdom',
    '025': 'Icelandic',
    '026': 'Belgian',
    '027': 'Taiwanese'
  }
}

export default DataTypes
