const express = require('express')
const router = express.Router()
const {
  getAllDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} = require('../utils/database')

// Get all communities or filter by location
router.get('/', async (req, res, next) => {
  try {
    const { region, province, city, barangay } = req.query
    let conditions = []

    if (region) {
      conditions.push({
        field: 'regionId',
        operator: '==',
        value: region,
      })
    }

    if (province) {
      conditions.push({
        field: 'provinceId',
        operator: '==',
        value: province,
      })
    }

    if (city) {
      conditions.push({
        field: 'cityId',
        operator: '==',
        value: city,
      })
    }

    if (barangay) {
      conditions.push({
        field: 'barangayId',
        operator: '==',
        value: barangay,
      })
    }

    const options = {
      orderBy: {
        field: 'membersCount',
        direction: 'desc',
      },
    }

    const communities =
      conditions.length > 0
        ? await queryDocuments('communities', conditions, options)
        : await getAllDocuments('communities')

    res.status(200).json({
      success: true,
      count: communities.length,
      data: communities,
    })
  } catch (error) {
    next(error)
  }
})

// Get trending communities
router.get('/trending', async (req, res, next) => {
  try {
    const options = {
      orderBy: {
        field: 'activity',
        direction: 'desc',
      },
      limit: 10,
    }

    const communities = await queryDocuments('communities', [], options)

    res.status(200).json({
      success: true,
      count: communities.length,
      data: communities,
    })
  } catch (error) {
    next(error)
  }
})

// Get a specific community
router.get('/:id', async (req, res, next) => {
  try {
    const community = await getDocumentById('communities', req.params.id)
    res.status(200).json({
      success: true,
      data: community,
    })
  } catch (error) {
    next(error)
  }
})

// Create a new community
router.post('/', async (req, res, next) => {
  try {
    // Validate the request body
    const {
      name,
      description,
      regionId,
      provinceId,
      cityId,
      barangayId,
      createdBy,
    } = req.body

    if (!name || !description || !regionId || !provinceId || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      })
    }

    // Create the community
    const community = {
      name,
      description,
      regionId,
      provinceId,
      cityId: cityId || null,
      barangayId: barangayId || null,
      createdBy,
      membersCount: 1,
      activity: 0,
      members: [createdBy],
    }

    const docRef = await addDocument('communities', community)

    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...community,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Join a community
router.post('/:id/join', async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user ID',
      })
    }

    // Get the community
    const community = await getDocumentById('communities', req.params.id)

    // Check if the user is already a member
    if (community.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this community',
      })
    }

    // Add the user to the members list
    community.members.push(userId)
    community.membersCount += 1

    // Update the community
    await updateDocument('communities', req.params.id, {
      members: community.members,
      membersCount: community.membersCount,
    })

    res.status(200).json({
      success: true,
      message: 'Successfully joined community',
    })
  } catch (error) {
    next(error)
  }
})

// Leave a community
router.post('/:id/leave', async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user ID',
      })
    }

    // Get the community
    const community = await getDocumentById('communities', req.params.id)

    // Check if the user is a member
    if (!community.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is not a member of this community',
      })
    }

    // Remove the user from the members list
    const updatedMembers = community.members.filter(
      (member) => member !== userId
    )

    // Update the community
    await updateDocument('communities', req.params.id, {
      members: updatedMembers,
      membersCount: updatedMembers.length,
    })

    res.status(200).json({
      success: true,
      message: 'Successfully left community',
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
