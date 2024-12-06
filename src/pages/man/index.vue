<template>
  <view class="container">
    <view class="header">
      <text class="title">男生版 - 相亲指数评估</text>
      <text class="subtitle">即将推出，敬请期待</text>
    </view>
    
    <view class="coming-soon">
      <image class="coming-soon-icon" src="../../static/images/man.svg" mode="aspectFit"></image>
      <text class="coming-soon-text">男生版功能正在开发中</text>
      <text class="coming-soon-desc">我们正在努力为您打造更专业的男性婚恋价值评估系统</text>
      <button class="back-btn" @click="goBack">返回首页</button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%);
  
  .header {
    text-align: center;
    margin: 60rpx 0;
    
    .title {
      font-size: 48rpx;
      font-weight: bold;
      color: #4a90e2;
      display: block;
      margin-bottom: 20rpx;
    }
    
    .subtitle {
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .coming-soon {
    text-align: center;
    margin-top: 100rpx;
    
    .coming-soon-icon {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 40rpx;
    }
    
    .coming-soon-text {
      font-size: 36rpx;
      color: #4a90e2;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .coming-soon-desc {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 60rpx;
      display: block;
    }
    
    .back-btn {
      width: 300rpx;
      height: 88rpx;
      line-height: 88rpx;
      background: #4a90e2;
      border-radius: 44rpx;
      font-size: 32rpx;
      color: #ffffff;
      
      &:active {
        opacity: 0.9;
      }
    }
  }
}
</style>
