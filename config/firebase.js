const { initializeApp } = require('firebase/app')
const { getFirestore } = require('firebase/firestore')
const { getAuth } = require('firebase/auth')
const { getStorage } = require('firebase/storage')

// Firebase configuration
// NOTE: In a production environment, these values should be stored in environment variables
const firebaseConfig = {
  apiKey: 'AIzaSyA9L1zp7FnEh7HZvcuRDM3PJqWnyOR1oCg',
  authDomain: 'comtok-c781f.firebaseapp.com',
  projectId: 'comtok-c781f',
  storageBucket: 'comtok-c781f.firebasestorage.app',
  messagingSenderId: '331612044234',
  appId: '1:331612044234:web:b72933adb98bc68e6c6d33',
  measurementId: 'G-H9VQEV5F94',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

module.exports = {
  app,
  db,
  auth,
  storage,
}
