// This script is used to check if a user is authenticated for protected pages
// Include this script after firebase-config.js on protected pages

function checkAuthentication() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        unsubscribe()
        if (user) {
          resolve(user)
        } else {
          // Redirect to login page if not authenticated
          window.location.href =
            'login.html?redirect=' +
            encodeURIComponent(window.location.pathname)
          reject('User not authenticated')
        }
      },
      (error) => {
        reject(error)
      }
    )
  })
}

// Execute the check when the script loads
checkAuthentication()
  .then((user) => {
    console.log('User authenticated:', user.uid)
    // You can call an initialization function here if needed
  })
  .catch((error) => {
    console.error('Authentication check failed:', error)
  })
