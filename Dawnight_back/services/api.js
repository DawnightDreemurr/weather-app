import axios from 'axios';
import { generateJWT } from'../utils/jwt.js';
import dotenv from 'dotenv';

dotenv.config({ path:'./config.env' ,quiet: true  });


const BaseURL = process.env.BASE_URL;
const api = axios.create({
  baseURL: BaseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let token = await generateJWT(); // 初始生成令牌

// 每两个半小时刷新一次令牌
const refreshInterval = 150 * 60 * 1000; // 150分钟（毫秒）
setInterval(async () => {
  try {
    token = await generateJWT();
    console.log('Token refreshed at:', new Date().toISOString());
  } catch (error) {
    console.error('Failed to refresh token:', error);
  }
}, refreshInterval);
// console.log(token);
// 监听进程退出信号（Ctrl+C、kill 命令等）
// process.on('SIGINT', () => {
//   clearInterval(refreshToken);
//   console.log('Process terminated. Token refresh stopped.');
//   process.exit(0); // 确保进程退出
// });
//
// process.on('SIGTERM', () => {
//   clearInterval(refreshToken);
//   console.log('Process terminated. Token refresh stopped.');
//   process.exit(0);
// });
//
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception:', err);
//   clearInterval(refreshToken);
//   process.exit(1);
// })

api.defaults.headers['Authorization'] = `Bearer ${token}`;

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

export default api
