import api from './apiService'
import { Province, City } from '@/types/location'
import * as mockService from './mockService'

// Get all provinces
export const getAllProvinces = async (): Promise<Province[]> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getAllProvinces()
  }

  try {
    const response = await api.get('/provinces')
    return response.data.data
  } catch (error) {
    console.error('Error fetching provinces:', error)
    return []
  }
}

// Get a province by ID
export const getProvinceById = async (id: number): Promise<Province | null> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getProvinceById(id)
  }

  try {
    const response = await api.get(`/provinces/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching province ${id}:`, error)
    return null
  }
}

// Get cities in a province
export const getCitiesByProvinceId = async (
  provinceId: number
): Promise<City[]> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getCitiesByProvinceId(provinceId)
  }

  try {
    const response = await api.get(`/cities?province_id=${provinceId}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching cities for province ${provinceId}:`, error)
    return []
  }
}

// Follow a province
export const followProvince = async (provinceId: number): Promise<boolean> => {
  try {
    await api.post(`/provinces/${provinceId}/follow`)
    return true
  } catch (error) {
    console.error(`Error following province ${provinceId}:`, error)
    return false
  }
}

// Unfollow a province
export const unfollowProvince = async (
  provinceId: number
): Promise<boolean> => {
  try {
    await api.delete(`/provinces/${provinceId}/follow`)
    return true
  } catch (error) {
    console.error(`Error unfollowing province ${provinceId}:`, error)
    return false
  }
}
