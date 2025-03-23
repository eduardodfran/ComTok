const { db } = require('../config/firebase')
const {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} = require('firebase/firestore')

/**
 * Get all documents from a collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Array>} - Array of documents
 */
const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Get a document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} - Document data
 */
const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error(`Document not found in ${collectionName}`)
    }

    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Add a new document to a collection
 * @param {string} collectionName - Name of the collection
 * @param {Object} data - Document data
 * @returns {Promise<Object>} - Added document reference
 */
const addDocument = async (collectionName, data) => {
  try {
    // Add timestamp
    data.createdAt = serverTimestamp()
    data.updatedAt = serverTimestamp()

    const docRef = await addDoc(collection(db, collectionName), data)
    return docRef
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error)
    throw error
  }
}

/**
 * Update a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Updated data
 * @returns {Promise<void>}
 */
const updateDocument = async (collectionName, docId, data) => {
  try {
    // Add updated timestamp
    data.updatedAt = serverTimestamp()

    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, data)
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Query documents based on conditions
 * @param {string} collectionName - Name of the collection
 * @param {Object} conditions - Query conditions
 * @param {Object} options - Query options (orderBy, limit)
 * @returns {Promise<Array>} - Array of documents
 */
const queryDocuments = async (
  collectionName,
  conditions = [],
  options = {}
) => {
  try {
    let q = collection(db, collectionName)

    // Add conditions
    if (conditions.length > 0) {
      conditions.forEach((condition) => {
        q = query(
          q,
          where(condition.field, condition.operator, condition.value)
        )
      })
    }

    // Add ordering
    if (options.orderBy) {
      q = query(
        q,
        orderBy(options.orderBy.field, options.orderBy.direction || 'asc')
      )
    }

    // Add limit
    if (options.limit) {
      q = query(q, limit(options.limit))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error)
    throw error
  }
}

module.exports = {
  getAllDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
}
