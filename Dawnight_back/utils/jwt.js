import { SignJWT, importPKCS8 } from 'jose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env',quiet: true   });


// 获取环境变量
const YourPrivateKey = process.env.PRIVATE_KEY;
const KeyID = process.env.KEY_ID;
const ProjectID = process.env.PROJECT_ID;

// 生成JWT的异步函数
export const generateJWT = async () => {
  try {
    // 加载私钥
    const privateKey = await importPKCS8(YourPrivateKey, 'EdDSA');

    // 创建自定义Header
    const customHeader = {
      alg: 'EdDSA',
      kid: KeyID
    };

    // 设置JWT的iat（签发时间）和exp（过期时间）
    const iat = Math.floor(Date.now() / 1000) - 30;
    const exp = iat + 9000; // JWT有效时间为150分钟

    // 创建自定义Payload
    const customPayload = {
      sub: ProjectID,
      iat: iat,
      exp: exp
    };

    // 生成并返回JWT
    return await new SignJWT(customPayload)
      .setProtectedHeader(customHeader)
      .sign(privateKey);
  } catch (error) {
    console.error('生成JWT失败:', error);
    throw error;
  }
};

