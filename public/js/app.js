// ComTok Frontend JavaScript
// This file handles the client-side interactions with the backend

// API URL - change this based on your deployment
const API_URL = 'http://localhost:3000/api'

// DOM elements
const regionSelect = document.getElementById('region-select')
const provinceSelect = document.getElementById('province-select')
const citySelect = document.getElementById('city-select')
const barangaySelect = document.getElementById('barangay-select')
const userActionsDiv = document.getElementById('user-actions')
const communityCards = document.querySelectorAll('.community-card')
const issueCards = document.querySelectorAll('.issue-card')
const createCommunityBtn = document.querySelector('.create-community .btn')
const signupButtons = document.querySelectorAll('.btn-primary.btn-large')
const exploreCommunities = document.querySelector('.hero-cta .btn-secondary')

// Firebase client setup
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'comtok.firebaseapp.com',
  projectId: 'comtok',
  storageBucket: 'comtok.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
}

// Initialize Firebase client
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

// Check authentication state
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log('User is signed in:', user.uid)
    updateUIForLoggedInUser(user)
  } else {
    // User is signed out
    console.log('User is signed out')
    updateUIForLoggedOutUser()
  }
})

// Function to update UI for logged in users
async function updateUIForLoggedInUser(user) {
  try {
    // Get user data from Firestore directly
    const docRef = db.collection('users').doc(user.uid)
    const docSnap = await docRef.get()

    if (docSnap.exists) {
      const userData = docSnap.data()

      // Update UI elements
      if (userActionsDiv) {
        userActionsDiv.innerHTML = `
          <div class="flex items-center gap-2">
            <img src="${
              userData.avatarUrl || 'https://via.placeholder.com/40'
            }" alt="${userData.username}" class="w-8 h-8 rounded-full">
            <div class="relative group">
              <button class="font-medium">${userData.username}</button>
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block z-50">
                <ul class="py-2">
                  <li><a href="profile.html" class="block px-4 py-2 hover:bg-gray-100">My Profile</a></li>
                  <li><a href="my-communities.html" class="block px-4 py-2 hover:bg-gray-100">My Communities</a></li>
                  <li><a href="settings.html" class="block px-4 py-2 hover:bg-gray-100">Settings</a></li>
                  <li><button id="logout-btn" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Log Out</button></li>
                </ul>
              </div>
            </div>
          </div>
        `

        // Add logout event listener
        document.getElementById('logout-btn')?.addEventListener('click', () => {
          auth
            .signOut()
            .then(() => {
              // Redirect to home page after logout
              window.location.href = 'index.html'
            })
            .catch((error) => {
              console.error('Error signing out:', error)
            })
        })
      }

      // Update join community buttons to show joined state for user's communities
      if (userData.joinedCommunities && userData.joinedCommunities.length > 0) {
        const joinButtons = document.querySelectorAll('.join-community')
        joinButtons.forEach((button) => {
          const communityId = button.dataset.id
          if (userData.joinedCommunities.includes(communityId)) {
            button.textContent = 'Joined'
            button.disabled = true
            button.classList.add('bg-gray-400')
            button.classList.remove('bg-primary', 'hover:bg-opacity-90')
          }
        })
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

// Function to update UI for logged out users
function updateUIForLoggedOutUser() {
  if (userActionsDiv) {
    userActionsDiv.innerHTML = `
      <a href="login.html" class="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-gray-100 transition duration-300 font-medium">Log In</a>
      <a href="signup.html" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition duration-300 font-medium">Sign Up</a>
    `
  }
}

// Event listeners for location selectors
if (regionSelect) {
  regionSelect.addEventListener('change', async function () {
    resetSelect(provinceSelect)
    resetSelect(citySelect)
    resetSelect(barangaySelect)

    const selectedRegion = this.value

    if (selectedRegion) {
      try {
        // Enable the province select and populate it
        provinceSelect.disabled = false

        // Fetch provinces from API
        const response = await fetch(
          `${API_URL}/regions/${selectedRegion}/provinces`
        )
        const data = await response.json()

        if (data.success) {
          populateSelect(provinceSelect, data.data)
        }
      } catch (error) {
        console.error('Error fetching provinces:', error)
      }
    } else {
      provinceSelect.disabled = true
      citySelect.disabled = true
      barangaySelect.disabled = true
    }
  })
}

if (provinceSelect) {
  provinceSelect.addEventListener('change', async function () {
    resetSelect(citySelect)
    resetSelect(barangaySelect)

    const selectedRegion = regionSelect.value
    const selectedProvince = this.value

    if (selectedProvince) {
      try {
        // Enable the city select and populate it
        citySelect.disabled = false

        // Fetch cities from API
        const response = await fetch(
          `${API_URL}/regions/${selectedRegion}/provinces/${selectedProvince}/cities`
        )
        const data = await response.json()

        if (data.success) {
          populateSelect(citySelect, data.data)
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
      }
    } else {
      citySelect.disabled = true
      barangaySelect.disabled = true
    }
  })
}

if (citySelect) {
  citySelect.addEventListener('change', async function () {
    resetSelect(barangaySelect)

    const selectedRegion = regionSelect.value
    const selectedProvince = provinceSelect.value
    const selectedCity = this.value

    if (selectedCity) {
      try {
        // Enable the barangay select and populate it
        barangaySelect.disabled = false

        // Fetch barangays from API
        const response = await fetch(
          `${API_URL}/regions/${selectedRegion}/provinces/${selectedProvince}/cities/${selectedCity}/barangays`
        )
        const data = await response.json()

        if (data.success) {
          populateSelectSimple(barangaySelect, data.data)
        }
      } catch (error) {
        console.error('Error fetching barangays:', error)
      }
    } else {
      barangaySelect.disabled = true
    }
  })
}

// Helper function to reset a select element
function resetSelect(selectElement) {
  if (!selectElement) return

  selectElement.innerHTML = ''
  const defaultOption = document.createElement('option')
  defaultOption.value = ''
  defaultOption.textContent = `Select ${
    selectElement.id.split('-')[0].charAt(0).toUpperCase() +
    selectElement.id.split('-')[0].slice(1)
  }`
  selectElement.appendChild(defaultOption)
}

// Helper function to populate a select element with object data
function populateSelect(selectElement, options) {
  if (!selectElement) return

  options.forEach((option) => {
    const optionElement = document.createElement('option')
    optionElement.value = option.id
    optionElement.textContent = option.name
    selectElement.appendChild(optionElement)
  })
}

// Helper function to populate a select element with simple array
function populateSelectSimple(selectElement, options) {
  if (!selectElement) return

  options.forEach((option) => {
    const optionElement = document.createElement('option')
    optionElement.value = option.id
    optionElement.textContent = option.name
    selectElement.appendChild(optionElement)
  })
}

// Initialize trending communities
async function fetchTrendingCommunities() {
  try {
    const response = await fetch(`${API_URL}/communities/trending`)
    const data = await response.json()

    if (data.success && data.data.length > 0) {
      // Update community cards with real data
      const communitiesGrid = document.querySelector('.communities-grid')

      if (communitiesGrid) {
        communitiesGrid.innerHTML = ''

        data.data.forEach((community) => {
          communitiesGrid.innerHTML += `
            <div class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 hover:-translate-y-1">
              <div class="h-48 overflow-hidden">
                <img
                  src="${
                    community.imageUrl ||
                    `https://source.unsplash.com/random/600x400/?${community.name.toLowerCase()}`
                  }"
                  alt="${community.name}"
                  class="w-full h-full object-cover transition duration-500 hover:scale-110"
                />
              </div>
              <div class="p-6">
                <h4 class="text-xl font-semibold text-primary mb-1">${
                  community.name
                }</h4>
                <p class="text-gray-500 text-sm mb-4">${
                  community.description
                }</p>
                <div class="flex justify-between text-gray-500 text-sm mb-6">
                  <span><i class="fas fa-users mr-2"></i> ${
                    community.membersCount
                  } members</span>
                  <span><i class="fas fa-comment-alt mr-2"></i> ${
                    community.activity
                  } active</span>
                </div>
                <button
                  class="w-full py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition duration-300 font-medium join-community"
                  data-id="${community.id}"
                >
                  Join
                </button>
              </div>
            </div>
          `
        })

        // Add event listeners to join buttons
        document.querySelectorAll('.join-community').forEach((button) => {
          button.addEventListener('click', joinCommunity)
        })
      }
    }
  } catch (error) {
    console.error('Error fetching trending communities:', error)
  }
}

// Initialize hot topics
async function fetchHotTopics() {
  try {
    const response = await fetch(`${API_URL}/posts/trending`)
    const data = await response.json()

    if (data.success && data.data.length > 0) {
      // Update issue cards with real data
      const issuesGrid = document.querySelector('.issues-grid')

      if (issuesGrid) {
        issuesGrid.innerHTML = ''

        data.data.forEach((post) => {
          // Format the timestamp
          const timestamp = new Date(post.createdAt.seconds * 1000)
          const timeAgo = formatTimeAgo(timestamp)

          issuesGrid.innerHTML += `
            <div class="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 hover:-translate-y-1 cursor-pointer" data-id="${
              post.id
            }">
              <div class="flex justify-between items-start mb-4">
                <span class="text-gray-500 text-sm">${
                  post.location.city || ''
                }, ${post.location.province || ''}</span>
                <span class="bg-red-100 text-secondary text-xs px-3 py-1 rounded-full font-semibold uppercase">${
                  post.category
                }</span>
              </div>
              <h4 class="text-lg font-bold mb-2">${post.title}</h4>
              <p class="text-gray-600 text-sm mb-4">
                ${post.content.substring(0, 100)}${
            post.content.length > 100 ? '...' : ''
          }
              </p>
              <div class="flex justify-between text-gray-500 text-sm">
                <span>${timeAgo}</span>
                <div class="flex gap-4">
                  <span><i class="fas fa-comment mr-1"></i> ${
                    post.comments
                  }</span>
                  <span><i class="fas fa-arrow-up mr-1"></i> ${
                    post.upvotes
                  }</span>
                </div>
              </div>
            </div>
          `
        })

        // Add event listeners to issue cards
        document.querySelectorAll('.issues-grid > div').forEach((card) => {
          card.addEventListener('click', function () {
            const postId = this.dataset.id
            window.location.href = `post.html?id=${postId}`
          })
        })
      }
    }
  } catch (error) {
    console.error('Error fetching hot topics:', error)
  }
}

// Join community function
async function joinCommunity(event) {
  event.preventDefault()

  const communityId = this.dataset.id

  // Check if user is logged in
  const user = auth.currentUser

  if (!user) {
    alert('Please log in to join communities')
    window.location.href = 'login.html'
    return
  }

  try {
    // 1. Add the community to the user's joinedCommunities
    const userRef = db.collection('users').doc(user.uid)

    // Get the current user data
    const userDoc = await userRef.get()
    if (!userDoc.exists) {
      throw new Error('User profile not found')
    }

    const userData = userDoc.data()

    // Check if already a member
    if (
      userData.joinedCommunities &&
      userData.joinedCommunities.includes(communityId)
    ) {
      alert('You are already a member of this community')
      return
    }

    // Update user's joined communities
    await userRef.update({
      joinedCommunities: firebase.firestore.FieldValue.arrayUnion(communityId),
    })

    // 2. Add the user to the community's members
    const communityRef = db.collection('communities').doc(communityId)

    // Get the current community data
    const communityDoc = await communityRef.get()
    if (!communityDoc.exists) {
      throw new Error('Community not found')
    }

    // Update community's members count and members array
    await communityRef.update({
      members: firebase.firestore.FieldValue.arrayUnion(user.uid),
      membersCount: firebase.firestore.FieldValue.increment(1),
    })

    // Update the button to show joined state
    this.textContent = 'Joined'
    this.disabled = true
    this.classList.add('bg-gray-400')
    this.classList.remove('bg-primary', 'hover:bg-opacity-90')

    alert('Successfully joined the community!')
  } catch (error) {
    console.error('Error joining community:', error)
    alert('Error joining community: ' + error.message)
  }
}

// Format time ago function
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`
  }

  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`
  }

  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`
  }

  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`
  }

  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`
  }

  return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Fetch trending communities
  fetchTrendingCommunities()

  // Fetch hot topics
  fetchHotTopics()

  // Initialize event listeners for location selectors
  if (regionSelect) {
    regionSelect.addEventListener('change', async function () {
      resetSelect(provinceSelect)
      resetSelect(citySelect)
      resetSelect(barangaySelect)

      const selectedRegion = this.value

      if (selectedRegion) {
        try {
          // Enable the province select and populate it
          provinceSelect.disabled = false

          // Fetch provinces from API
          const response = await fetch(
            `${API_URL}/regions/${selectedRegion}/provinces`
          )
          const data = await response.json()

          if (data.success) {
            populateSelect(provinceSelect, data.data)
          }
        } catch (error) {
          console.error('Error fetching provinces:', error)
        }
      } else {
        provinceSelect.disabled = true
        citySelect.disabled = true
        barangaySelect.disabled = true
      }
    })
  }

  if (provinceSelect) {
    provinceSelect.addEventListener('change', async function () {
      resetSelect(citySelect)
      resetSelect(barangaySelect)

      const selectedRegion = regionSelect.value
      const selectedProvince = this.value

      if (selectedProvince) {
        try {
          // Enable the city select and populate it
          citySelect.disabled = false

          // Fetch cities from API
          const response = await fetch(
            `${API_URL}/regions/${selectedRegion}/provinces/${selectedProvince}/cities`
          )
          const data = await response.json()

          if (data.success) {
            populateSelect(citySelect, data.data)
          }
        } catch (error) {
          console.error('Error fetching cities:', error)
        }
      } else {
        citySelect.disabled = true
        barangaySelect.disabled = true
      }
    })
  }

  if (citySelect) {
    citySelect.addEventListener('change', async function () {
      resetSelect(barangaySelect)

      const selectedRegion = regionSelect.value
      const selectedProvince = provinceSelect.value
      const selectedCity = this.value

      if (selectedCity) {
        try {
          // Enable the barangay select and populate it
          barangaySelect.disabled = false

          // Fetch barangays from API
          const response = await fetch(
            `${API_URL}/regions/${selectedRegion}/provinces/${selectedProvince}/cities/${selectedCity}/barangays`
          )
          const data = await response.json()

          if (data.success) {
            populateSelectSimple(barangaySelect, data.data)
          }
        } catch (error) {
          console.error('Error fetching barangays:', error)
        }
      } else {
        barangaySelect.disabled = true
      }
    })
  }
})
