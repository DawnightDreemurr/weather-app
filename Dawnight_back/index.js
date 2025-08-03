import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import xss from 'xss';
import router from './routes/index.js';

const app = express();

// 1. 安全相关的HTTP头设置
app.use(helmet());

// 2. 开发环境下的详细日志，生产环境使用精简日志
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 3. 限制请求体大小
app.use(express.json({ limit: '10kb' })); // 防止过大的JSON请求体

// 4. 数据清洗
const xssMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(xss(JSON.stringify(req.body)));
  }
  next();
};
app.use(express.json());
app.use(xssMiddleware);

// 5. 防止HTTP参数污染
app.use(hpp());

// 6. CORS配置（生产环境应明确指定允许的源）
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-production-domain.com']
    : ['http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// 7. 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 500, // 每个IP限制100个请求
  message: '请求过于频繁，请稍后再试'
});
app.use('/v1', limiter); // 只对API路由应用速率限制

// 8. 路由前缀
app.use('/v1', router); // 所有路由现在需要以 /v1 开头

// 9. 安全相关的HTTP头
app.disable('x-powered-by'); // 移除X-Powered-By头

// 10. 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);

  // 不要在生产环境中暴露详细的错误信息
  const errorResponse = process.env.NODE_ENV === 'production'
    ? { error: 'Something went wrong!' }
    : { error: err.message, stack: err.stack };

  res.status(500).json(errorResponse);
});

// 11. 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 12. 设置安全cookie（如果使用cookie）
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // 信任第一个代理
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务启动在 http://localhost:${port}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

