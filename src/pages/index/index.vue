<template>
  <view class="container">
    <view class="header">
      <view class="brand">
        <text class="brand-text">爱情Lab</text>
        <text class="brand-slogan">遇见科学的浪漫 💕</text>
      </view>
      <text class="title">相亲魅力指数--遇见更好的自己</text>
      <text class="subtitle">一起探索你的魅力潜力值 ✨</text>
      <text class="subtitle">自研AI算法，科学计算你的颜值指数✨</text>
      <view class="decoration">
        <view class="circle circle-1"></view>
        <view class="circle circle-2"></view>
        <view class="circle circle-3"></view>
      </view>
    </view>
    
    <view class="gender-cards">
      <view class="gender-card woman" hover-class="card-hover" @click="selectGender('female')">
        <view class="card-content">
          <image class="gender-icon" src="../../static/images/woman.svg" mode="aspectFit"></image>
          <text class="gender-title">魅力女生</text>
          <text class="gender-desc">发现属于你的独特光芒✨</text>
          <view class="features">
            <view class="feature-item">
              <text class="feature-dot">💫</text>
              <text class="feature-text">智能城市匹配</text>
            </view>
            <view class="feature-item">
              <text class="feature-dot">🌟</text>
              <text class="feature-text">全方位魅力解析</text>
            </view>
            <view class="feature-item">
              <text class="feature-dot">💝</text>
              <text class="feature-text">贴心建议</text>
            </view>
          </view>
        </view>
        <view class="card-decoration"></view>
      </view>
      
      <view class="gender-card man" hover-class="card-hover" @click="selectGender('male')">
        <view class="card-content">
          <image class="gender-icon" src="../../static/images/man.svg" mode="aspectFit"></image>
          <text class="gender-title">品质男生</text>
          <text class="gender-desc">发现你的独特魅力价值</text>
          <view class="features">
            <view class="feature-item">
              <text class="feature-dot">⭐</text>
              <text class="feature-text">全方位分析</text>
            </view>
            <view class="feature-item">
              <text class="feature-dot">🎯</text>
              <text class="feature-text">精准定位</text>
            </view>
            <view class="feature-item">
              <text class="feature-dot">📈</text>
              <text class="feature-text">个性化提升方案</text>
            </view>
          </view>
        </view>
        <text class="coming-soon">即将闪亮登场</text>
        <view class="card-decoration"></view>
      </view>
    </view>

    <view class="ad-container">
      <ad-custom 
        unit-id="adunit-xxxxxxxxxxxxxxxx" 
        ad-type="banner" 
        ad-theme="white">
      </ad-custom>
    </view>

    <view class="relationship-test-link" @click="openRelationshipTest">
      <text class="relationship-test-text">💕 感情关系测试</text>
      <text class="relationship-test-icon">→</text>
    </view>

    <view class="tips">
      <view class="tip-header">
        <text class="tip-title">小贴士</text>
        <view class="tip-line"></view>
      </view>
      <view class="tip-content">
        <text class="tip-item">💫 轻松测评，只需3-5分钟</text>
        <text class="tip-item">💝 真实的你，才是最美的</text>
        <text class="tip-item">🔒 隐私安全，贴心保护</text>
      </view>
    </view>

    <view class="footer">
      <text class="footer-text">遇见心动，遇见美好的你 💖</text>
    </view>
    <view class="follow-us">
            <view class="follow-content">
              <text class="follow-title">关注我们</text>
              <image class="qr-code" src="@/static/qr.jpg" mode="aspectFit"></image>
              <text class="follow-desc">扫码关注获取更多资讯</text>
            </view>
          </view>
    <view></view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.initBaiduAnalytics();
  },
  methods: {
    initBaiduAnalytics() {
      // 确保在客户端环境中运行
      if (typeof window !== 'undefined') {
        window._hmt = window._hmt || [];
        const hm = document.createElement('script');
        hm.src = 'https://hm.baidu.com/hm.js?a2e1dda791e37f17ddffc039aca159ec';
        const s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(hm, s);

        // 添加路由变化时的页面浏览统计
        this.$router.afterEach((to) => {
          if (window._hmt) {
            window._hmt.push(['_trackPageview', to.fullPath]);
          }
        });
      }
    },
    selectGender(gender) {
      if (gender === 'female') {
        // 女生版本保持不变
        uni.navigateTo({
          url: '/pages/woman/assessment'
        })
      } else if (gender === 'male') {
        // 跨平台兼容的跳转方案
        try {
          // H5 环境直接跳转
          window.location.href = 'https://man.qioo.fun'
        } catch (error) {
          console.error('跳转异常:', error)
          uni.showToast({
            title: '跳转失败，请稍后重试',
            icon: 'none'
          })
        }
      }
    },
    openRelationshipTest() {
      // 平台兼容的跳转方法
      // #ifdef H5
      window.open('https://cuckold.qioo.fun/', '_blank');
      // #endif

      // #ifndef H5
      uni.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent('https://cuckold.qioo.fun/')
      });
      // #endif
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #fff0f6 0%, #ffffff 100%);
  position: relative;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
  animation: fadeIn 0.8s ease-in-out;
}

.brand {
  margin-bottom: 40rpx;
  animation: floatIn 1s ease-out;
}

.brand-text {
  font-size: 56rpx;
  font-weight: bold;
  background: linear-gradient(45deg, #ff4d8f, #ff85a2);
  -webkit-background-clip: text;
  color: transparent;
  display: block;
  margin-bottom: 8rpx;
  letter-spacing: 2rpx;
}

.brand-slogan {
  font-size: 24rpx;
  color: #ff85a2;
  opacity: 0.8;
  display: block;
}

.title {
  font-size: 48rpx;
  color: #ff4d8f;
  font-weight: bold;
  margin-bottom: 16rpx;
  display: block;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.gender-cards {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  margin-bottom: 40rpx;
}

.gender-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24rpx;
  padding: 40rpx;
  position: relative;
  box-shadow: 0 8rpx 32rpx rgba(255, 77, 143, 0.1);
  transition: all 0.3s ease;
}

.card-hover {
  transform: translateY(-6rpx);
  box-shadow: 0 12rpx 48rpx rgba(255, 77, 143, 0.15);
}

.woman {
  border: 2rpx solid #ff9ec3;
  background: linear-gradient(135deg, #fff9fb 0%, #fff 100%);
}

.man {
  border: 2rpx solid #a8d8ff;
  background: linear-gradient(135deg, #f5faff 0%, #fff 100%);
  opacity: 0.8;
}

.gender-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.gender-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.gender-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.feature-text {
  font-size: 26rpx;
  color: #666;
}

.coming-soon {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  background: #ff4d8f;
  color: white;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
}

.relationship-test-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  border-radius: 20rpx;
  background: #fff;
  box-shadow: 0 8rpx 32rpx rgba(255, 77, 143, 0.1);
  margin-bottom: 40rpx;
}

.relationship-test-text {
  font-size: 30rpx;
  color: #ff4d8f;
  margin-right: 12rpx;
}

.relationship-test-icon {
  font-size: 24rpx;
  color: #ff4d8f;
}

.tips {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 40rpx;
}

.tip-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.tip-title {
  font-size: 30rpx;
  color: #ff4d8f;
  font-weight: bold;
}

.tip-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.tip-item {
  font-size: 26rpx;
  color: #666;
}

.footer-text {
  font-size: 28rpx;
  color: #999;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(-30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.follow-us {
    margin-top: 30rpx;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    
    .follow-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .follow-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 20rpx;
      }

      .qr-code {
        width: 240rpx;
        height: 240rpx;
        margin: 10rpx 0;
      }

      .follow-desc {
        font-size: 24rpx;
        color: #666;
        margin-top: 10rpx;
      }
    }
  }
</style>
