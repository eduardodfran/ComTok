/**
 * This script handles Google authentication for ComTok
 * It provides a common function for both login and signup with Google
 */

/**
 * Sign in or sign up with Google
 * @param {firebase.auth.Auth} auth - Firebase auth instance
 * @param {firebase.firestore.Firestore} db - Firestore instance
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
async function signInWithGoogle(auth, db, onSuccess, onError) {
  try {
    // Create a Google auth provider
    const provider = new firebase.auth.GoogleAuthProvider()

    // Optional: Add scopes if needed
    provider.addScope('profile')
    provider.addScope('email')

    // Sign in with popup
    const result = await auth.signInWithPopup(provider)
    const user = result.user

    // Check if this is a new user
    const isNewUser = result.additionalUserInfo.isNewUser

    // Check if user exists in our Firestore database regardless of isNewUser
    // (just as a safeguard)
    const userDoc = await db.collection('users').doc(user.uid).get()

    if (!userDoc.exists) {
      // Create a new user profile if this is first time login
      // Extract username from email (before the @)
      const emailUsername = user.email.split('@')[0]
      // Generate a unique username by appending some random chars
      const uniqueUsername = `${emailUsername}_${Math.random()
        .toString(36)
        .substring(2, 7)}`

      // Create the user profile in Firestore
      await db
        .collection('users')
        .doc(user.uid)
        .set({
          uid: user.uid,
          username: uniqueUsername,
          email: user.email,
          avatarUrl: user.photoURL || null,
          bio: '',
          joinedCommunities: [],
          postCount: 0,
          commentCount: 0,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }

    // Call success callback with user and whether they're new
    onSuccess(user, isNewUser)
  } catch (error) {
    // Call error callback with the error
    onError(error)
  }
}
