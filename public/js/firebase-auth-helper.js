/**
 * Firebase Authentication Helper
 * Provides consistent methods for auth operations across the app
 */

// Email & Password Authentication
async function signInWithEmailPassword(email, password, rememberMe = false) {
  // Set persistence based on remember me option
  const persistence = rememberMe
    ? firebase.auth.Auth.Persistence.LOCAL
    : firebase.auth.Auth.Persistence.SESSION

  try {
    await auth.setPersistence(persistence)
    return await auth.signInWithEmailAndPassword(email, password)
  } catch (error) {
    console.error('Email/Password sign in error:', error)
    throw translateAuthError(error)
  }
}

async function createUserWithEmailPassword(email, password, userData) {
  try {
    // Create the authentication user
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    )
    const user = userCredential.user

    // Create user profile in Firestore
    await createUserProfile(user, userData)

    return userCredential
  } catch (error) {
    console.error('Email/Password sign up error:', error)
    throw translateAuthError(error)
  }
}

// Google Authentication
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')

  try {
    // Use redirect for mobile, popup for desktop
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      await auth.signInWithRedirect(provider)
      return null // Result will be handled by getRedirectResult
    } else {
      const result = await auth.signInWithPopup(provider)
      const user = result.user

      // Check if this is a new user and create profile if needed
      const userDoc = await db.collection('users').doc(user.uid).get()
      if (!userDoc.exists) {
        const userData = extractUserDataFromGoogle(user)
        await createUserProfile(user, userData)
      }

      return result
    }
  } catch (error) {
    console.error('Google sign in error:', error)
    throw translateAuthError(error)
  }
}

async function handleRedirectResult() {
  try {
    const result = await auth.getRedirectResult()
    if (result.user) {
      // Check if this is a new user and create profile if needed
      const userDoc = await db.collection('users').doc(result.user.uid).get()
      if (!userDoc.exists) {
        const userData = extractUserDataFromGoogle(result.user)
        await createUserProfile(result.user, userData)
      }
    }
    return result
  } catch (error) {
    console.error('Redirect result error:', error)
    throw translateAuthError(error)
  }
}

// Helper Functions
function extractUserDataFromGoogle(user) {
  // Extract username from email (before the @)
  const emailUsername = user.email.split('@')[0]
  // Generate a unique username
  const uniqueUsername = `${emailUsername}_${Math.random()
    .toString(36)
    .substring(2, 6)}`

  return {
    username: uniqueUsername,
    email: user.email,
    avatarUrl: user.photoURL,
    bio: '',
  }
}

async function createUserProfile(user, userData) {
  try {
    await db
      .collection('users')
      .doc(user.uid)
      .set({
        uid: user.uid,
        username: userData.username,
        email: userData.email,
        avatarUrl: userData.avatarUrl || null,
        bio: userData.bio || '',
        joinedCommunities: [],
        postCount: 0,
        commentCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

function translateAuthError(error) {
  // Translate Firebase auth errors to user-friendly messages
  let userMessage = 'An error occurred during authentication. Please try again.'

  const errorMap = {
    'auth/email-already-in-use': 'This email address is already in use.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/user-not-found': 'Invalid email or password.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/weak-password':
      'Password is too weak. Please choose a stronger password.',
    'auth/popup-closed-by-user':
      'The authentication popup was closed. Please try again.',
    'auth/popup-blocked':
      'The authentication popup was blocked. Please allow popups for this site.',
    'auth/too-many-requests':
      'Too many failed login attempts. Please try again later.',
    'auth/configuration-not-found':
      'Authentication service is not configured properly. Please try email/password login instead or contact support.',
    'auth/network-request-failed':
      'Network error. Please check your internet connection.',
  }

  if (error.code && errorMap[error.code]) {
    userMessage = errorMap[error.code]
  }

  // Create a new error with the user-friendly message but keep the original code
  const translatedError = new Error(userMessage)
  translatedError.code = error.code
  translatedError.originalError = error

  return translatedError
}
