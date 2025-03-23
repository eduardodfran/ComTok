/**
 * This script handles redirects after login/signup
 * It looks for a 'redirect' query parameter in the URL and stores it in sessionStorage
 * After a successful login/signup, it redirects the user to the stored URL
 */

// Parse URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

// Store redirect URL in session storage if present in URL
const redirectUrl = getUrlParameter('redirect')
if (redirectUrl) {
  sessionStorage.setItem('redirectAfterAuth', redirectUrl)
}

// Function to perform redirect if there's a stored URL
function redirectAfterAuth() {
  const redirectUrl = sessionStorage.getItem('redirectAfterAuth')
  if (redirectUrl) {
    sessionStorage.removeItem('redirectAfterAuth')
    window.location.href = redirectUrl
    return true
  }
  return false
}
