const express = require('express')
const router = express.Router()
const {
  getAllDocuments,
  getDocumentById,
  queryDocuments,
} = require('../utils/database')

// Get all regions
router.get('/', async (req, res, next) => {
  try {
    const regions = await getAllDocuments('regions')
    res.status(200).json({
      success: true,
      count: regions.length,
      data: regions,
    })
  } catch (error) {
    next(error)
  }
})

// Get a specific region
router.get('/:id', async (req, res, next) => {
  try {
    const region = await getDocumentById('regions', req.params.id)
    res.status(200).json({
      success: true,
      data: region,
    })
  } catch (error) {
    next(error)
  }
})

// Get provinces by region
router.get('/:regionId/provinces', async (req, res, next) => {
  try {
    const conditions = [
      {
        field: 'regionId',
        operator: '==',
        value: req.params.regionId,
      },
    ]

    const provinces = await queryDocuments('provinces', conditions)

    res.status(200).json({
      success: true,
      count: provinces.length,
      data: provinces,
    })
  } catch (error) {
    next(error)
  }
})

// Get cities by province
router.get(
  '/:regionId/provinces/:provinceId/cities',
  async (req, res, next) => {
    try {
      const conditions = [
        {
          field: 'provinceId',
          operator: '==',
          value: req.params.provinceId,
        },
      ]

      const cities = await queryDocuments('cities', conditions)

      res.status(200).json({
        success: true,
        count: cities.length,
        data: cities,
      })
    } catch (error) {
      next(error)
    }
  }
)

// Get barangays by city
router.get(
  '/:regionId/provinces/:provinceId/cities/:cityId/barangays',
  async (req, res, next) => {
    try {
      const conditions = [
        {
          field: 'cityId',
          operator: '==',
          value: req.params.cityId,
        },
      ]

      const barangays = await queryDocuments('barangays', conditions)

      res.status(200).json({
        success: true,
        count: barangays.length,
        data: barangays,
      })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
