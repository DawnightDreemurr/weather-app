import express from 'express';
import {
  getWeatherNow,
  getDailyWeather,
  getHourlyWeather,
  getWeatherAlerts,
  getNowAirQuality,
  getWeatherIndexForecast,
  getMinutePrecipitation
} from '../controller/weatherApis.js';
import {getLocation} from '../controller/getLocation.js'

const router = express.Router();

//获取地理位置
router.get('/location',getLocation);

// 获取当前天气
router.get('/now', getWeatherNow);

// 获取每日天气预报
router.get('/daily', getDailyWeather);

// 获取每小时天气预报
router.get('/hourly', getHourlyWeather);

// 获取天气警报
router.get('/alerts', getWeatherAlerts);

// 获取当前空气质量
router.get('/air', getNowAirQuality);

// 获取天气指数预报
router.get('/index', getWeatherIndexForecast);

// 获取分钟级降水预报
router.get('/precipitation', getMinutePrecipitation);

router.get('/', (req, res) => {
  res.json({
    message: 'Weather API endpoints',
    endpoints: [
      '/now - 当前天气',
      '/daily - 每日预报',
      '/hourly - 每小时预报',
      '/alerts - 天气警报',
      '/air-quality - 空气质量',
      '/index - 天气指数',
      '/precipitation - 降水预报'
    ]
  });
});

export default router;
