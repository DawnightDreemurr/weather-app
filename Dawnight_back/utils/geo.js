import api from '../services/api.js'

// 城市搜索（仅关键词）
export const searchCities = async (keyword) => {
  if (!keyword) return [] // 空值保护

  try {
    const response = await api.get('/geo/v2/city/lookup', {
      params: { location: keyword, range: 'cn' }
    })

    // 返回城市数组或空数组
    return response?.code === '200' ? response || [] : []
  } catch (error) {
    console.error('搜索城市失败:', error)
    return [] // 出错返回空数组
  }
}

// 通过城市ID精确查询
export const getCityById = async (id) => {
  const cities = await searchCities(id)
  return cities[0] || null // 返回第一个或null
}

