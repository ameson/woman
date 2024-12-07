import CryptoJS from 'crypto-js'

// API配置
const API_CONFIG = {
  baseUrl: 'https://face-api-9xer.onrender.com',
  apiKey: import.meta.env.VITE_API_KEY,
  secretKey: import.meta.env.VITE_SECRET_KEY
}

// 检查配置
if (!API_CONFIG.apiKey || !API_CONFIG.secretKey) {
  console.error('错误: API密钥未配置。请在.env文件中设置VITE_API_KEY和VITE_SECRET_KEY')
}

// 生成签名
function generateSignature(apiKey, timestamp, params = {}) {
  let message = `${apiKey}${timestamp}`
  
  if (Object.keys(params).length > 0) {
    const sortedParams = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}${v}`)
      .join('')
    message += sortedParams
  }

  console.log('签名字符串:', message) // 调试用
  
  const signature = CryptoJS.HmacSHA256(
    message,
    API_CONFIG.secretKey
  ).toString(CryptoJS.enc.Hex)

  console.log('生成的签名:', signature) // 调试用
  
  return signature
}

// 颜值打分接口
export const uploadFaceImage = (image) => {
  return new Promise((resolve, reject) => {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    
    // 请求参数
    const formData = {
      type: 'face'
    }
    
    // 生成签名
    const signature = generateSignature(API_CONFIG.apiKey, timestamp, formData)
    
    // 打印请求信息（调试用）
    console.log('请求信息:', {
      url: `${API_CONFIG.baseUrl}/api/predict`,
      headers: {
        'X-API-Key': API_CONFIG.apiKey,
        'X-Timestamp': timestamp,
        'X-Signature': signature
      },
      formData
    })
    
    // 发送请求
    uni.uploadFile({
      url: `${API_CONFIG.baseUrl}/api/predict`,
      filePath: image,
      name: 'image',
      formData: formData,
      header: {
        'X-API-Key': API_CONFIG.apiKey,
        'X-Timestamp': timestamp,
        'X-Signature': signature
      },
      success: (response) => {
        try {
          console.log('服务器响应:', response.data) // 调试用
          const result = JSON.parse(response.data)
          if (result.code === 0) {
            resolve(result.data.score)  // 返回1-10的分数
          } else {
            reject(new Error(result.message || '评分失败'))
          }
        } catch (error) {
          console.error('解析响应失败:', error)
          reject(new Error('服务器响应格式错误'))
        }
      },
      fail: (error) => {
        console.error('上传失败:', error)
        reject(new Error('网络请求失败'))
      }
    })
  })
}
