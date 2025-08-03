import api from '../services/api.js'
import { searchCities } from '../utils/geo.js'

//获得实时天气
export const getWeatherNow = async (req, res) => {
  try {
    const result = await api.get('/v7/weather/now', {
      params: {
        location: req.query.location || '101060101' //默认长春
      }
    })
    res.status(200).json({
      success: true,
      data: result,
      message: '实时天气数据获取成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取实时天气数据时发生错误',
      error: error
    })
    console.error('获得实时天气请求错误:', error)
  }
}

//获得每日天气
export const getDailyWeather = async (req, res) => {
  try {
    // 可以选择 7d 10d 15d 30d 每日天气预报
    const result = await api.get('/v7/weather/10d', {
      params: {
        location: req.query.location || '101060101' //默认长春
      }
    })
    res.status(200).json({
      success: true,
      data: result,
      message: '天气数据获取成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取天气数据时发生错误',
      error: error
    })
    console.error('获得每日天气请求错误:', error)
  }
}
//获得每小时天气
export const getHourlyWeather = async (req, res) => {
  try {
    // 可以选择 24h 72h 168h 每小时天气预报
    const result = await api.get('/v7/weather/24h', {
      params: {
        location: req.query.location || '101060101' //默认长春
      }
    })
    res.status(200).json({
      success: true,
      data: result,
      message: '每小时天气数据获取成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取每小时天气数据时发生错误',
      error: error
    })
    console.error('获得每小时天气请求错误:', error)
  }
}

//分钟级降水
export const getMinutePrecipitation = async (req, res) => {
  try {
    const result = await api.get('/v7/minutely/5m', {
      params: {
        location: req.query.location || '101060101' //默认长春
      }
    })
    res.status(200).json({
      success: true,
      data: result,
      message: '分钟级降水数据获取成功'
    })
  } catch (error) {
    if (error.response && error.response.status === 400) {
      res.status(400).json({
        success: false,
        message: '该地区无分钟级降水数据',
        error: error
      })
    } else {
      res.status(500).json({
        success: false,
        message: '获取分钟级降水数据时发生错误',
        error: error
      })
    }
    console.error('获得分钟级降水请求错误:', error)
  }
}

//天气灾害预警
export const getWeatherAlerts = async (req, res) => {
  try {
    const result = await api.get('/v7/warning/now', {
      params: {
        location: req.query.location || '101060101' //默认长春
      }
    })
    res.status(200).json({
      success: true,
      data: result,
      message: '天气灾害预警数据获取成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取天气灾害预警数据时发生错误',
      error: error
    })
    console.error('获得天气灾害预警请求错误:', error)
  }
}

//天气指数预报
export const getWeatherIndexForecast = async (req, res) => {
  try {
    const response = await api.get('/v7/indices/1d', {
      params: {
        location: req.query.location || '101060101', // 默认长春
        type: '1,2,3,4,5,6' // 生活指数类型ID
      }
    })

    let processedData = response
    if (response.daily) {
      processedData = {
        ...response,
        daily: response.daily.length >= 6
          ? response.daily
          : response.daily.slice(0, 3)
      }
    }

    res.status(200).json({
      success: true,
      data: processedData,
      message: '天气指数预报数据获取成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取天气指数预报数据时发生错误',
      error: error
    })
    console.error('获取天气指数预报请求错误:', error)
  }
}

//实时空气质量
export const getNowAirQuality = async (req, res) => {
  try {
    const result = await searchCities(req.query.location || '101060101')
    const { lat = 43.81700, lon = 125.32364 } = result.location[0]
    const airQuality = await api.get(`/airquality/v1/current/${lat}/${lon}`, {})

    res.status(200).json({
      success: true,
      data: airQuality,
      message: '实时空气质量数据获取成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取实时空气质量数据时发生错误',
      error: error
    })
    console.error('获得实时空气质量请求错误:', error)
  }
}



