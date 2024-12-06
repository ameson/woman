<template>
  <view class="city-guide" v-if="visible">
    <view class="guide-header">
      <text class="guide-title">城市等级指南 🌆</text>
      <text class="close-btn" @click="close">×</text>
    </view>
    
    <scroll-view class="guide-content" scroll-y>
      <view class="tier-section" v-for="(tier, index) in cityTiers" :key="index">
        <view class="tier-header">
          <text class="tier-name">{{ tier.name }}</text>
          <text class="tier-brief">{{ tier.brief }}</text>
        </view>
        <view class="city-list">
          <text class="city-item" v-for="(city, idx) in tier.cities" :key="idx">
            {{ city }}
          </text>
        </view>
        <text class="tier-desc">{{ tier.description }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'CityTierGuide',
  data() {
    return {
      visible: false,
      cityTiers: [
        {
          name: '一线城市',
          brief: '国际化大都市',
          cities: ['北京', '上海', '广州', '深圳'],
          description: '经济、文化、科技高度发达，就业机会多，收入水平高，但生活成本也相对较高。'
        },
        {
          name: '新一线城市',
          brief: '区域中心城市',
          cities: ['成都', '杭州', '武汉', '西安', '南京', '郑州', '长沙', '天津', '苏州', '重庆', '青岛', '宁波', '东莞', '佛山', '合肥'],
          description: '经济快速发展，生活节奏相对舒适，机遇与压力并存，性价比较高。'
        },
        {
          name: '二线城市',
          brief: '省会及经济发达城市',
          cities: ['昆明', '福州', '济南', '大连', '贵阳', '温州', '石家庄', '南宁', '无锡', '厦门', '哈尔滨', '长春', '泉州', '南昌', '金华'],
          description: '城市发展稳定，生活压力适中，适合寻求工作与生活平衡。'
        },
        {
          name: '三线城市',
          brief: '地级市',
          cities: ['常州', '嘉兴', '珠海', '中山', '惠州', '徐州', '太原', '绍兴', '台州', '烟台', '兰州'],
          description: '生活节奏较慢，房价相对较低，适合追求安逸生活。'
        }
      ]
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.city-guide {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-height: 80vh;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  .guide-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 2rpx solid #f5f5f5;
    
    .guide-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #ff4d8f;
    }
    
    .close-btn {
      font-size: 48rpx;
      color: #999;
      padding: 0 20rpx;
    }
  }
  
  .guide-content {
    padding: 30rpx;
    max-height: calc(80vh - 100rpx);
  }
  
  .tier-section {
    margin-bottom: 40rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .tier-header {
      margin-bottom: 20rpx;
      
      .tier-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-right: 16rpx;
      }
      
      .tier-brief {
        font-size: 24rpx;
        color: #666;
        background: #fff0f6;
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
      }
    }
    
    .city-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      margin-bottom: 16rpx;
      
      .city-item {
        font-size: 26rpx;
        color: #ff4d8f;
        background: #fff0f6;
        padding: 8rpx 24rpx;
        border-radius: 30rpx;
      }
    }
    
    .tier-desc {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}
</style>
