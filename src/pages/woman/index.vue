<template>
  <view class="container">
    <view class="header">
      <text class="title">相亲指数 · 女生篇</text>
      <text class="subtitle">遇见更好的自己 💝</text>
    </view>
    
    <view class="city-select">
      <view class="label-group">
        <text class="label">选择所在城市</text>
        <text class="help-icon" @click="showCityGuide">❓</text>
      </view>
      <picker mode="selector" :range="cityLevels" @change="onCityChange">
        <view class="picker" :class="{ 'picker-empty': !selectedCity }">
          <text>{{ selectedCity || '点击选择城市等级' }}</text>
          <text class="picker-arrow" :class="{ 'arrow-animate': !selectedCity }">👉</text>
        </view>
      </picker>
    </view>

    <button class="start-btn" :disabled="!selectedCity" @click="startAssessment">
      <text class="btn-text">{{ selectedCity ? '开始测评' : '请先选择城市' }}</text>
      <text class="btn-icon">✨</text>
    </button>

    <view class="dimension-list">
      <text class="dimension-title">测评维度</text>
      <view class="dimension-item" v-for="(item, index) in dimensions" :key="index">
        <view class="dimension-icon">{{ item.icon }}</view>
        <view class="dimension-content">
          <text class="dimension-name">{{ item.name }}</text>
          <text class="dimension-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <view class="advantages">
      <text class="advantages-title">测评优势</text>
      <view class="advantage-items">
        <view class="advantage-item" v-for="(item, index) in advantages" :key="index">
          <text class="advantage-icon">{{ item.icon }}</text>
          <text class="advantage-text">{{ item.text }}</text>
        </view>
      </view>
    </view>

    <view class="tips">
      <text class="tip-title">贴心提示</text>
      <text class="tip-item">💫 测评时长：3-5分钟</text>
      <text class="tip-item">💝 真实填写，遇见真实的自己</text>
      <text class="tip-item">🔒 数据安全，隐私保护</text>
    </view>

    <CityTierGuide ref="cityGuide" />
  </view>
</template>

<script>
import CityTierGuide from '../../components/CityTierGuide.vue'

export default {
  components: {
    CityTierGuide
  },
  data() {
    return {
      cityLevels: ['一线城市', '新一线城市', '二线城市', '三线城市'],
      selectedCity: '',
      dimensions: [
        {
          icon: '👗',
          name: '形象魅力',
          desc: '外在形象、穿搭品味、个人气质'
        },
        {
          icon: '🎓',
          name: '学历背景',
          desc: '教育程度、学校层次、专业方向'
        },
        {
          icon: '💼',
          name: '事业成就',
          desc: '职业发展、收入水平、职场竞争力'
        },
        {
          icon: '🏠',
          name: '生活品质',
          desc: '居住条件、生活方式、消费能力'
        },
        {
          icon: '💖',
          name: '情感态度',
          desc: '恋爱观念、婚姻期待、家庭责任感'
        }
      ],
      advantages: [
        {
          icon: '🎯',
          text: '专业算法评估'
        },
        {
          icon: '📊',
          text: '多维度分析'
        },
        {
          icon: '💡',
          text: '个性化建议'
        },
        {
          icon: '🔄',
          text: '持续更新迭代'
        }
      ]
    }
  },
  methods: {
    onCityChange(e) {
      this.selectedCity = this.cityLevels[e.detail.value]
    },
    showCityGuide() {
      this.$refs.cityGuide.show()
    },
    startAssessment() {
      if (!this.selectedCity) {
        uni.showToast({
          title: '请先选择城市等级哦～',
          icon: 'none'
        })
        return
      }
      
      uni.navigateTo({
        url: './assessment?city=' + encodeURIComponent(this.selectedCity)
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #fff0f6 0%, #ffffff 100%);
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
  
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
  }
}

.city-select {
  margin-bottom: 40rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 77, 143, 0.1);
  
  .label-group {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 16rpx;
  }
  
  .label {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
  }
  
  .help-icon {
    font-size: 28rpx;
    color: #ff4d8f;
    padding: 4rpx 12rpx;
  }
  
  .picker {
    background: #fff5f8;
    padding: 24rpx;
    border-radius: 16rpx;
    font-size: 30rpx;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    &.picker-empty {
      color: #999;
    }
    
    .picker-arrow {
      font-size: 32rpx;
      transition: transform 0.3s ease;
      
      &.arrow-animate {
        animation: bounceRight 1.5s infinite;
      }
    }
  }
}

.dimension-list {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 77, 143, 0.1);
  
  .dimension-title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 24rpx;
    display: block;
  }
  
  .dimension-item {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
    padding: 20rpx;
    background: #fff5f8;
    border-radius: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .dimension-icon {
      font-size: 40rpx;
      margin-right: 20rpx;
    }
    
    .dimension-content {
      flex: 1;
    }
    
    .dimension-name {
      font-size: 28rpx;
      color: #ff4d8f;
      font-weight: bold;
      margin-bottom: 8rpx;
      display: block;
    }
    
    .dimension-desc {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.advantages {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 77, 143, 0.1);
  
  .advantages-title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 24rpx;
    display: block;
  }
  
  .advantage-items {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
  }
  
  .advantage-item {
    display: flex;
    align-items: center;
    padding: 16rpx;
    background: #fff5f8;
    border-radius: 16rpx;
    
    .advantage-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
    }
    
    .advantage-text {
      font-size: 26rpx;
      color: #666;
    }
  }
}

.tips {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 77, 143, 0.1);
  
  .tip-title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .tip-item {
    font-size: 26rpx;
    color: #666;
    line-height: 1.8;
    display: block;
  }
}

.start-btn {
  background: linear-gradient(135deg, #ff6b81 0%, #ff4d8f 100%);
  border: none;
  border-radius: 20rpx;
  padding: 24rpx 40rpx;
  margin: 30rpx 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-shadow: 0 8rpx 20rpx rgba(255, 77, 143, 0.2);
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 10rpx rgba(255, 77, 143, 0.2);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #ffb3c0 0%, #ff9eb7 100%);
    box-shadow: none;
  }
  
  .btn-text {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .btn-icon {
    font-size: 32rpx;
  }
}

@keyframes bounceRight {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10rpx);
  }
}
</style>
