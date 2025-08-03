import api from '../services/api.js'

// 城市搜索（仅关键词）
export const getLocation = async (req, res) => {
  if (!req.query.location) {
    res.status(200).json({
      success: true,
      data: [],
      message: '默认值'
    })
  } else {
    try {
      const response = await api.get('/geo/v2/city/lookup', {
        params: { location: req.query.location || '长春', range: 'cn' }
      })
      // 返回城市数组或空数组
      res.status(200).json({
        success: true,
        data: response,
        message: '城市信息获取成功'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '城市信息获取失败',
        error: error
      })
    }
  }
}

