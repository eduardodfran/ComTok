// Firebase configuration for client-side use
const firebaseConfig = {
  apiKey: 'AIzaSyA9L1zp7FnEh7HZvcuRDM3PJqWnyOR1oCg',
  authDomain: 'comtok-c781f.firebaseapp.com',
  projectId: 'comtok-c781f',
  storageBucket: 'comtok-c781f.appspot.com',
  messagingSenderId: '331612044234',
  appId: '1:331612044234:web:b72933adb98bc68e6c6d33',
  measurementId: 'G-H9VQEV5F94',
}

// Initialize Firebase with the config
firebase.initializeApp(firebaseConfig)

// Get authentication instance
const auth = firebase.auth()

// Configure auth settings for local development
// This helps when testing on localhost
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) {
  auth.useEmulator('http://localhost:9099')
}

// Export the common instances
const db = firebase.firestore()
const storage = firebase.storage()

// Ensure Google Auth Provider is properly initialized
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
// Add scopes if needed
googleAuthProvider.addScope('profile')
googleAuthProvider.addScope('email')

// Log authentication state for debugging
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.uid)
  } else {
    console.log('No user is signed in.')
  }
})
