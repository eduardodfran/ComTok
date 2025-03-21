document.addEventListener('DOMContentLoaded', function() {
    // Location navigation selectors
    const continentSelect = document.getElementById('continent-select');
    const countrySelect = document.getElementById('country-select');
    const regionSelect = document.getElementById('region-select');
    const citySelect = document.getElementById('city-select');

    // Sample location data (in a real app, this would come from an API)
    const locationData = {
        asia: {
            philippines: {
                'metro-manila': ['Taguig City', 'Makati City', 'Manila City', 'Quezon City', 'Pasig City'],
                'central-luzon': ['Angeles City', 'San Fernando', 'Olongapo City'],
                'calabarzon': ['Calamba City', 'Batangas City', 'Tagaytay City']
            },
            thailand: {
                'bangkok-metropolitan': ['Bangkok', 'Nonthaburi', 'Pathum Thani'],
                'northern-thailand': ['Chiang Mai', 'Chiang Rai', 'Lampang']
            },
            japan: {
                'greater-tokyo': ['Tokyo', 'Yokohama', 'Kawasaki', 'Saitama'],
                'kansai': ['Osaka', 'Kyoto', 'Kobe']
            }
        },
        europe: {
            'united-kingdom': {
                'greater-london': ['London', 'Croydon', 'Barnet', 'Bromley'],
                'west-midlands': ['Birmingham', 'Coventry', 'Wolverhampton']
            },
            france: {
                'ile-de-france': ['Paris', 'Versailles', 'Saint-Denis'],
                'provence': ['Marseille', 'Aix-en-Provence', 'Avignon']
            }
        },
        'north-america': {
            'united-states': {
                'new-york-state': ['New York City', 'Buffalo', 'Rochester'],
                california: ['Los Angeles', 'San Francisco', 'San Diego'],
                texas: ['Houston', 'Dallas', 'Austin']
            },
            canada: {
                ontario: ['Toronto', 'Ottawa', 'Hamilton'],
                quebec: ['Montreal', 'Quebec City', 'Laval']
            }
        }
    };

    // Event listeners for the location selectors
    continentSelect.addEventListener('change', function() {
        resetSelect(countrySelect);
        resetSelect(regionSelect);
        resetSelect(citySelect);
        
        const selectedContinent = this.value;
        
        if (selectedContinent) {
            // Enable the country select and populate it
            countrySelect.disabled = false;
            const countries = Object.keys(locationData[selectedContinent]);
            
            populateSelect(countrySelect, countries);
        } else {
            countrySelect.disabled = true;
            regionSelect.disabled = true;
            citySelect.disabled = true;
        }
    });

    countrySelect.addEventListener('change', function() {
        resetSelect(regionSelect);
        resetSelect(citySelect);
        
        const selectedContinent = continentSelect.value;
        const selectedCountry = this.value;
        
        if (selectedCountry) {
            // Enable the region select and populate it
            regionSelect.disabled = false;
            const regions = Object.keys(locationData[selectedContinent][selectedCountry]);
            
            populateSelect(regionSelect, regions);
        } else {
            regionSelect.disabled = true;
            citySelect.disabled = true;
        }
    });

    regionSelect.addEventListener('change', function() {
        resetSelect(citySelect);
        
        const selectedContinent = continentSelect.value;
        const selectedCountry = countrySelect.value;
        const selectedRegion = this.value;
        
        if (selectedRegion) {
            // Enable the city select and populate it
            citySelect.disabled = false;
            const cities = locationData[selectedContinent][selectedCountry][selectedRegion];
            
            populateSelect(citySelect, cities, false);
        } else {
            citySelect.disabled = true;
        }
    });

    citySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        
        if (selectedCity) {
            // In a real app, this would navigate to the city page
            console.log('Navigate to city: ' + selectedCity);
        }
    });

    // Helper function to reset a select element
    function resetSelect(selectElement) {
        selectElement.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = `Select ${selectElement.id.split('-')[0].charAt(0).toUpperCase() + selectElement.id.split('-')[0].slice(1)}`;
        selectElement.appendChild(defaultOption);
    }

    // Helper function to populate a select element
    function populateSelect(selectElement, options, formatOption = true) {
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = formatOption ? formatValue(option) : option;
            optionElement.textContent = formatOption ? formatDisplay(option) : option;
            selectElement.appendChild(optionElement);
        });
    }

    // Format value for select options (convert spaces to dashes and lowercase)
    function formatValue(str) {
        return str.toLowerCase().replace(/\s+/g, '-');
    }

    // Format display text for select options (capitalize words and replace dashes with spaces)
    function formatDisplay(str) {
        return str.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Toggle mobile navigation
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Initialize trending issue posts with like and comment functionality
    const issueCards = document.querySelectorAll('.issue-card');
    
    issueCards.forEach(card => {
        // In a real app, you'd have event listeners for like/comment buttons
        card.addEventListener('click', function() {
            // Navigate to the issue detail page
            const issueTitle = this.querySelector('h4').textContent;
            console.log('Navigate to issue: ' + issueTitle);
        });
    });
});