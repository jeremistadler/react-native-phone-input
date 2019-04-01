import orderBy from 'lodash/orderBy'

let instance = null

class Country {
  static getInstance() {
    if (!instance) {
      instance = new Country()
    }
    return instance
  }

  constructor() {
    this.countryCodes = []

    this.countriesData = null
  }

  setCustomCountriesData(json) {
    this.countriesData = json
  }

  addCountryCode(iso2, dialCode, priority) {
    if (!(dialCode in this.countryCodes)) {
      this.countryCodes[dialCode] = []
    }

    const index = priority || 0
    this.countryCodes[dialCode][index] = iso2
  }

  getAll() {
    if (!this.countries) {
      this.countries = orderBy(
        this.countriesData || require('./resources/countries.json'),
        ['name'],
        ['asc']
      )
    }

    return this.countries
  }

  getCountryCodes() {
    if (!this.countryCodes.length) {
      this.getAll().map(country => {
        this.addCountryCode(country.iso2, country.dialCode, country.priority)
        if (country.areaCodes) {
          country.areaCodes.map(areaCode => {
            this.addCountryCode(country.iso2, country.dialCode + areaCode)
          })
        }
      })
    }
    return this.countryCodes
  }

  getCountryDataByCode(iso2) {
    this.getAll().find(country => country.iso2 === iso2)
  }
}

export default Country.getInstance()
