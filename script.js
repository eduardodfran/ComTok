document.addEventListener('DOMContentLoaded', function () {
  // Location navigation selectors
  const regionSelect = document.getElementById('region-select')
  const provinceSelect = document.getElementById('province-select')
  const citySelect = document.getElementById('city-select')
  const barangaySelect = document.getElementById('barangay-select')

  // Sample location data for Philippines (in a real app, this would come from an API)
  const philippinesData = {
    ncr: {
      name: 'National Capital Region',
      provinces: {
        'metro-manila': {
          name: 'Metro Manila',
          cities: {
            manila: {
              name: 'Manila City',
              barangays: [
                'Binondo',
                'Ermita',
                'Intramuros',
                'Malate',
                'Quiapo',
                'Sampaloc',
                'San Nicolas',
                'Santa Cruz',
                'Tondo',
              ],
            },
            'quezon-city': {
              name: 'Quezon City',
              barangays: [
                'Bagong Silangan',
                'Batasan Hills',
                'Commonwealth',
                'Fairview',
                'Kamuning',
                'Lagro',
                'Novaliches',
                'Project 6',
                'Santa Lucia',
              ],
            },
            makati: {
              name: 'Makati City',
              barangays: [
                'Ayala North',
                'Bel-Air',
                'Dasmarinas',
                'Magallanes',
                'Poblacion',
                'San Lorenzo',
                'Urdaneta',
                'Valenzuela',
              ],
            },
            taguig: {
              name: 'Taguig City',
              barangays: [
                'Fort Bonifacio',
                'McKinley Hill',
                'Ususan',
                'Western Bicutan',
                'Upper Bicutan',
                'Pinagsama',
                'Bagumbayan',
                'Ligid-Tipas',
              ],
            },
            pasig: {
              name: 'Pasig City',
              barangays: [
                'Kapitolyo',
                'Manggahan',
                'Maybunga',
                'Oranbo',
                'San Antonio',
                'Ugong',
                'Rosario',
                'Santolan',
              ],
            },
          },
        },
      },
    },
    region3: {
      name: 'Central Luzon',
      provinces: {
        bulacan: {
          name: 'Bulacan',
          cities: {
            malolos: {
              name: 'Malolos City',
              barangays: [
                'Balite',
                'Bulihan',
                'Caniogan',
                'Guinhawa',
                'Longos',
                'Mojon',
                'Panasahan',
                'Santisima Trinidad',
              ],
            },
            meycauayan: {
              name: 'Meycauayan City',
              barangays: [
                'Bahay Pare',
                'Calvario',
                'Hulo',
                'Langka',
                'Malhacan',
                'Perez',
                'Saluysoy',
                'Tugatog',
              ],
            },
          },
        },
        pampanga: {
          name: 'Pampanga',
          cities: {
            angeles: {
              name: 'Angeles City',
              barangays: [
                'Balibago',
                'Cutcut',
                'Lourdes Sur',
                'Margot',
                'Pulung Maragul',
                'Santo Rosario',
                'Tabun',
              ],
            },
            'san-fernando': {
              name: 'San Fernando City',
              barangays: [
                'Calulut',
                'Del Carmen',
                'Juliana',
                'Panipuan',
                'San Isidro',
                'Santo Niño',
                'Telabastagan',
              ],
            },
          },
        },
      },
    },
    region7: {
      name: 'Central Visayas',
      provinces: {
        cebu: {
          name: 'Cebu',
          cities: {
            'cebu-city': {
              name: 'Cebu City',
              barangays: [
                'Apas',
                'Banilad',
                'Capitol Site',
                'Guadalupe',
                'Lahug',
                'Mabolo',
                'Punta Princesa',
                'Talamban',
              ],
            },
            mandaue: {
              name: 'Mandaue City',
              barangays: [
                'Alang-Alang',
                'Bakilid',
                'Cambaro',
                'Guizo',
                'Ibabao',
                'Looc',
                'Mantuyong',
                'Subangdaku',
                'Tipolo',
              ],
            },
          },
        },
        bohol: {
          name: 'Bohol',
          cities: {
            tagbilaran: {
              name: 'Tagbilaran City',
              barangays: [
                'Bool',
                'Cogon',
                'Dao',
                'Mansasa',
                'Poblacion',
                'San Isidro',
                'Taloto',
                'Ubujan',
              ],
            },
          },
        },
      },
    },
  }

  // Event listeners for the location selectors
  regionSelect.addEventListener('change', function () {
    resetSelect(provinceSelect)
    resetSelect(citySelect)
    resetSelect(barangaySelect)

    const selectedRegion = this.value

    if (selectedRegion && philippinesData[selectedRegion]) {
      // Enable the province select and populate it
      provinceSelect.disabled = false

      // Get provinces from the selected region
      const provinces = philippinesData[selectedRegion].provinces
      populateSelect(provinceSelect, provinces)
    } else {
      provinceSelect.disabled = true
      citySelect.disabled = true
      barangaySelect.disabled = true
    }
  })

  provinceSelect.addEventListener('change', function () {
    resetSelect(citySelect)
    resetSelect(barangaySelect)

    const selectedRegion = regionSelect.value
    const selectedProvince = this.value

    if (
      selectedProvince &&
      philippinesData[selectedRegion]?.provinces[selectedProvince]
    ) {
      // Enable the city select and populate it
      citySelect.disabled = false

      // Get cities from the selected province
      const cities =
        philippinesData[selectedRegion].provinces[selectedProvince].cities
      populateSelect(citySelect, cities)
    } else {
      citySelect.disabled = true
      barangaySelect.disabled = true
    }
  })

  citySelect.addEventListener('change', function () {
    resetSelect(barangaySelect)

    const selectedRegion = regionSelect.value
    const selectedProvince = provinceSelect.value
    const selectedCity = this.value

    if (
      selectedCity &&
      philippinesData[selectedRegion]?.provinces[selectedProvince]?.cities[
        selectedCity
      ]
    ) {
      // Enable the barangay select and populate it
      barangaySelect.disabled = false

      // Get barangays from the selected city
      const barangays =
        philippinesData[selectedRegion].provinces[selectedProvince].cities[
          selectedCity
        ].barangays
      populateSelectSimple(barangaySelect, barangays)
    } else {
      barangaySelect.disabled = true
    }
  })

  // Helper function to reset a select element
  function resetSelect(selectElement) {
    selectElement.innerHTML = ''
    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = `Select ${
      selectElement.id.split('-')[0].charAt(0).toUpperCase() +
      selectElement.id.split('-')[0].slice(1)
    }`
    selectElement.appendChild(defaultOption)
  }

  // Helper function to populate a select element with simple array
  function populateSelectSimple(selectElement, options) {
    options.forEach((option) => {
      const optionElement = document.createElement('option')
      optionElement.value = formatValue(option)
      optionElement.textContent = option
      selectElement.appendChild(optionElement)
    })
  }

  // Helper function to populate a select element with object data
  function populateSelect(selectElement, options) {
    Object.keys(options).forEach((key) => {
      const optionElement = document.createElement('option')
      optionElement.value = key
      optionElement.textContent = options[key].name
      selectElement.appendChild(optionElement)
    })
  }

  // Format value for select options (convert spaces to dashes and lowercase)
  function formatValue(str) {
    return str.toLowerCase().replace(/\s+/g, '-')
  }

  // Initialize community cards
  const communityCards = document.querySelectorAll('.community-card')
  communityCards.forEach((card) => {
    card.querySelector('.btn').addEventListener('click', function (e) {
      e.preventDefault()
      const communityName = card.querySelector('h4').textContent
      alert(`You've joined the ${communityName} community!`)
    })
  })

  // Initialize issue cards
  const issueCards = document.querySelectorAll('.issue-card')
  issueCards.forEach((card) => {
    card.addEventListener('click', function () {
      const issueTitle = this.querySelector('h4').textContent
      const location = this.querySelector('.location').textContent
      window.location.href = `issue-details.html?title=${encodeURIComponent(
        issueTitle
      )}&location=${encodeURIComponent(location)}`
    })
  })

  // Community creation button
  const createCommunityBtn = document.querySelector('.create-community .btn')
  if (createCommunityBtn) {
    createCommunityBtn.addEventListener('click', function () {
      window.location.href = 'create-community.html'
    })
  }

  // Sign up button in hero and join section
  const signupButtons = document.querySelectorAll('.btn-primary.btn-large')
  signupButtons.forEach((button) => {
    button.addEventListener('click', function () {
      window.location.href = 'signup.html'
    })
  })

  // Explore communities button
  const exploreCommunities = document.querySelector('.hero-cta .btn-secondary')
  if (exploreCommunities) {
    exploreCommunities.addEventListener('click', function () {
      window.location.href = 'explore.html'
    })
  }
})
