# Face Beauty Score API 文档

## API 概述

该API提供人脸美感评分服务，评分范围为1-10分。

## 基础信息

- 基础URL: `http://localhost:5000`
- 所有请求需要包含API密钥
- 所有响应均为JSON格式

## 认证

所有请求需要包含以下Header：
```
X-API-Key: your-api-key-here
X-Timestamp: current-unix-timestamp
X-Signature: request-signature
```

### 签名生成规则

1. 获取当前Unix时间戳（秒）作为`X-Timestamp`
2. 按以下规则生成签名字符串：
   - 基础字符串 = API密钥 + 时间戳
   - 如果有请求参数，将所有参数按键名排序，然后拼接到基础字符串
3. 使用HMAC-SHA256算法，以服务器提供的Secret Key对字符串进行签名
4. 将生成的十六进制签名字符串作为`X-Signature`

示例（Python）：
```python
import hmac
import hashlib
import time

def generate_signature(api_key, secret_key, params=None):
    timestamp = str(int(time.time()))
    message = f"{api_key}{timestamp}"
    
    if params:
        sorted_params = sorted(params.items())
        message += ''.join(f"{k}{v}" for k, v in sorted_params)
    
    signature = hmac.new(
        secret_key.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return {
        'X-API-Key': api_key,
        'X-Timestamp': timestamp,
        'X-Signature': signature
    }
```

### 安全说明

1. 时间戳验证：
   - 服务器只接受5分钟内的请求
   - 超时请求会被拒绝，需要重新生成签名

2. API密钥管理：
   - 不要在客户端代码中硬编码API密钥
   - 定期轮换API密钥
   - 每个客户端使用独立的API密钥

3. 传输安全：
   - 生产环境必须使用HTTPS
   - 建议使用TLS 1.3或更高版本

## 接口限制

- 每分钟最多10次请求
- 每天最多100次请求

## 评分接口

### POST /api/predict

对上传的人脸图片进行美感评分。

#### 请求方式

支持两种方式上传图片：

1. multipart/form-data
```
POST /api/predict
Content-Type: multipart/form-data
X-API-Key: your-api-key-here
X-Timestamp: current-unix-timestamp
X-Signature: request-signature

Form Data:
- image: [图片文件]
```

2. JSON with Base64
```
POST /api/predict
Content-Type: application/json
X-API-Key: your-api-key-here
X-Timestamp: current-unix-timestamp
X-Signature: request-signature

{
    "image_base64": "base64编码的图片数据"
}
```

#### 响应格式

```json
{
    "code": 0,           // 0表示成功，非0表示错误
    "message": "success", // 状态描述
    "data": {
        "raw_score": 0.7234,    // 原始分数(0-1)
        "score": 7.2,           // 最终分数(1-10)
        "percentage": 72.34,     // 百分比
        "details": {
            "original_score": 0.7156,  // 原始图片得分
            "flipped_score": 0.7312,   // 翻转图片得分
            "scoring_system": "1-10分制"
        }
    }
}
```

#### 错误码说明

- 401: 未授权（API密钥无效或缺失）
- 400: 请求参数错误
- 429: 请求过于频繁
- 500: 服务器内部错误

## Node.js 调用示例

### 安装依赖

```bash
npm install axios form-data crypto-js
```

### 完整示例代码

```javascript
const axios = require('axios');
const FormData = require('form-data');
const CryptoJS = require('crypto-js');
const fs = require('fs');

// API配置
const API_CONFIG = {
  baseUrl: 'http://127.0.0.1:5000',
  apiKey: 'sk_test_f7HKLGNfA9XmB4Vc5DwS2Pq8RjY3TuE6',
  secretKey: 'sk_secret_L9nM7vK4hJ2fX8pR5tQ6wB3cY0gN1aD9EmZbW4xU3sPyA6kC8jH7'
};

// 生成签名
function generateSignature(apiKey, timestamp, params = {}) {
  let message = `${apiKey}${timestamp}`;
  
  if (Object.keys(params).length > 0) {
    const sortedParams = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
    message += sortedParams.map(([k, v]) => `${k}${v}`).join('');
  }
  
  return CryptoJS.HmacSHA256(message, API_CONFIG.secretKey).toString(CryptoJS.enc.Hex);
}

// 使用文件路径上传图片
async function uploadImageFile(imagePath) {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const formData = new FormData();
    
    // 添加图片文件
    formData.append('image', fs.createReadStream(imagePath));
    formData.append('type', 'face');
    
    // 准备签名参数
    const params = {
      type: 'face'
    };
    
    // 生成签名
    const signature = generateSignature(API_CONFIG.apiKey, timestamp, params);
    
    // 发送请求
    const response = await axios.post(`${API_CONFIG.baseUrl}/api/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': API_CONFIG.apiKey,
        'X-Timestamp': timestamp,
        'X-Signature': signature
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.data.message}`);
    } else {
      throw error;
    }
  }
}

// 使用Base64上传图片
async function uploadBase64Image(base64Data) {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // 准备请求数据
    const requestData = {
      image_base64: base64Data,
      type: 'face'
    };
    
    // 生成签名
    const signature = generateSignature(API_CONFIG.apiKey, timestamp, requestData);
    
    // 发送请求
    const response = await axios.post(`${API_CONFIG.baseUrl}/api/predict`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.apiKey,
        'X-Timestamp': timestamp,
        'X-Signature': signature
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.data.message}`);
    } else {
      throw error;
    }
  }
}

// 使用示例
async function example() {
  try {
    // 使用文件上传
    console.log('上传文件示例：');
    const fileResult = await uploadImageFile('./example.jpg');
    console.log('文件上传评分结果:', fileResult.data.score);
    
    // 使用Base64上传
    console.log('\n上传Base64示例：');
    const imageBuffer = fs.readFileSync('./example.jpg');
    const base64Data = imageBuffer.toString('base64');
    const base64Result = await uploadBase64Image(base64Data);
    console.log('Base64上传评分结果:', base64Result.data.score);
    
  } catch (error) {
    console.error('评分失败:', error.message);
  }
}

// Express中间件示例
function apiAuthMiddleware(req, res, next) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = req.method === 'POST' ? req.body : req.query;
  
  // 生成签名
  const signature = generateSignature(API_CONFIG.apiKey, timestamp, params);
  
  // 添加认证头
  req.headers['X-API-Key'] = API_CONFIG.apiKey;
  req.headers['X-Timestamp'] = timestamp;
  req.headers['X-Signature'] = signature;
  
  next();
}

// 在Express路由中使用
const express = require('express');
const router = express.Router();

router.post('/score-face', apiAuthMiddleware, async (req, res) => {
  try {
    const result = await uploadImageFile(req.files.image.path);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      code: -1,
      message: error.message
    });
  }
});

module.exports = {
  uploadImageFile,
  uploadBase64Image,
  generateSignature,
  apiAuthMiddleware
};
```

### 错误处理最佳实践

```javascript
class APIError extends Error {
  constructor(message, code, response) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.response = response;
  }
}

async function uploadWithRetry(imagePath, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await uploadImageFile(imagePath);
    } catch (error) {
      lastError = error;
      
      // 判断是否需要重试
      if (error.response && error.response.status === 429) {
        // 请求频率限制，等待后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      // 其他错误直接抛出
      throw new APIError(
        error.message,
        error.response?.data?.code || -1,
        error.response?.data
      );
    }
  }
  
  throw new APIError(
    `Maximum retries (${maxRetries}) exceeded`,
    -1,
    lastError.response?.data
  );
}
```

### TypeScript 类型定义

```typescript
interface APIConfig {
  baseUrl: string;
  apiKey: string;
  secretKey: string;
}

interface APIResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

interface ScoreResult {
  raw_score: number;
  score: number;
  percentage: number;
  details: {
    original_score: number;
    flipped_score: number;
    scoring_system: string;
  };
}

type UploadFunction = (image: string | Buffer) => Promise<APIResponse<ScoreResult>>;
```

## UniApp 完整调用示例

```javascript
// 安装依赖
// npm install crypto-js

import CryptoJS from 'crypto-js';

// 配置
const API_CONFIG = {
  baseUrl: 'http://127.0.0.1:5000',
  apiKey: 'sk_test_f7HKLGNfA9XmB4Vc5DwS2Pq8RjY3TuE6',    // API密钥
  secretKey: 'sk_secret_L9nM7vK4hJ2fX8pR5tQ6wB3cY0gN1aD9EmZbW4xU3sPyA6kC8jH7'    // 签名密钥
};

// 生成签名
function generateSignature(apiKey, timestamp, params = {}) {
  // 构建签名字符串：apiKey + timestamp + 排序后的参数
  let message = `${apiKey}${timestamp}`;
  
  if (Object.keys(params).length > 0) {
    const sortedParams = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
    message += sortedParams.map(([k, v]) => `${k}${v}`).join('');
  }
  
  // 使用HMAC-SHA256生成签名
  return CryptoJS.HmacSHA256(message, API_CONFIG.secretKey).toString(CryptoJS.enc.Hex);
}

// 颜值打分接口
export const uploadFaceImage = async (image) => {
  try {
    // 生成当前时间戳（秒）
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // 请求参数
    const formData = {
      type: 'face'
    };
    
    // 生成签名
    const signature = generateSignature(API_CONFIG.apiKey, timestamp, formData);
    
    // 发送请求
    const response = await uni.uploadFile({
      url: `${API_CONFIG.baseUrl}/api/predict`,
      filePath: image,
      name: 'image',
      header: {
        'X-API-Key': API_CONFIG.apiKey,
        'X-Timestamp': timestamp,
        'X-Signature': signature
      },
      formData: formData
    });
    
    const result = JSON.parse(response.data);
    if (result.code === 0) {
      return result.data.score;  // 返回1-10的分数
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Face score API error:', error);
    throw error;
  }
}

// 使用示例
async function scoreFace(imagePath) {
  try {
    const score = await uploadFaceImage(imagePath);
    console.log(`颜值得分: ${score}`);
  } catch (error) {
    console.error('评分失败:', error);
  }
}
```

### 请求流程说明

1. 准备请求参数：
   - 生成当前时间戳（Unix时间戳，秒级）
   - 准备请求参数（如果有）
   - 设置API密钥

2. 生成请求签名：
   - 拼接签名字符串：apiKey + timestamp + 排序后的参数
   - 使用HMAC-SHA256和密钥生成签名

3. 发送请求：
   - 设置必要的请求头：
     * X-API-Key: API密钥
     * X-Timestamp: 时间戳
     * X-Signature: 签名
   - 上传图片文件
   - 添加其他参数（如果有）

4. 处理响应：
   - 解析JSON响应
   - 处理成功/失败情况
   - 提取评分结果

### 错误处理

API可能返回以下错误码：

- 401: 认证失败
  * 缺少必要的请求头
  * API密钥无效
  * 签名验证失败
  * 请求已过期

- 400: 请求参数错误
  * 缺少必要参数
  * 参数格式错误
  * 图片格式不支持

- 429: 请求频率超限
  * 超过每分钟请求限制
  * 超过每天请求限制

### 安全建议

1. 密钥管理：
   - 不要在前端代码中硬编码API密钥和Secret
   - 使用安全的配置管理系统存储密钥
   - 定期轮换密钥

2. 请求安全：
   - 使用HTTPS传输
   - 验证服务器证书
   - 实现请求重试机制

3. 错误处理：
   - 实现优雅的错误处理
   - 记录错误日志
   - 向用户展示友好的错误信息

## 注意事项

1. 图片要求：
   - 支持的格式：JPG, PNG
   - 建议分辨率：至少224x224
   - 最大文件大小：5MB

2. 安全性：
   - 请妥善保管API密钥
   - 不要在客户端代码中硬编码API密钥
   - 建议通过后端中转API调用

3. 性能优化：
   - 建议在上传前压缩图片
   - 可以缓存评分结果
   - 批量处理时注意限流规则
