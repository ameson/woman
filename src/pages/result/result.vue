<template>
  <view class="container">
    <view class="score-card">
      <view class="score-header">
        <text class="score-title">您的相亲指数得分</text>
        <text class="score-value">{{ finalScore }}</text>
        <text class="score-level">{{ scoreLevel.title }}</text>
      </view>
      
      <view class="score-details">
        <text class="detail-title">得分解读</text>
        <text class="detail-text">{{ scoreLevel.description }}</text>
      </view>

      <view class="city-adjustment">
        <text class="city-title">城市等级：{{ city }}</text>
        <text class="city-note">* 分数已根据所在城市进行调整</text>
      </view>
    </view>

    <view class="dimension-cards">
      <view class="dimension-card" v-for="(dimension, index) in dimensionResults" :key="index">
        <view class="dimension-header">
          <text class="dimension-icon">{{ dimension.icon }}</text>
          <text class="dimension-name">{{ dimension.name }}</text>
          <text class="dimension-score">{{ dimension.score }}分</text>
        </view>
        <text class="dimension-comment">{{ dimension.comment }}</text>
      </view>
    </view>

    <view class="advice-card">
      <text class="advice-title">建议</text>
      <view class="advice-list">
        <text class="advice-item" v-for="(advice, index) in scoreLevel.advice" :key="index">
          {{ advice }}
        </text>
      </view>
    </view>

    <view class="button-group">
      <button class="share-btn" open-type="share">分享结果</button>
      <button class="restart-btn" type="primary" @click="restart">重新测评</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      score: 0,
      city: '',
      dimensionScores: {},
      scoreLevels: [
        {
          min: 90,
          title: '极优秀',
          description: '您的综合条件非常出色，是相亲市场的优质候选人。您的学历、事业、个人能力等各方面都表现优异。',
          advice: [
            '可以适当提高择偶标准',
            '建议通过高端相亲平台寻找对象',
            '保持当前的优势，继续提升自我'
          ]
        },
        {
          min: 80,
          title: '优秀',
          description: '您的整体条件良好，具有较强的竞争力。在主要评估维度上都有不错的表现。',
          advice: [
            '可以考虑拓展社交圈',
            '建议参加高质量的社交活动',
            '在个别方面还有提升空间'
          ]
        },
        {
          min: 70,
          title: '良好',
          description: '您的条件处于中上水平，有一定的竞争优势，但仍有提升空间。',
          advice: [
            '建议在事业发展上继续努力',
            '可以考虑提升个人技能和学历',
            '扩大社交圈，增加机会'
          ]
        },
        {
          min: 60,
          title: '中等',
          description: '您的条件处于平均水平，在某些方面还需要继续提升。',
          advice: [
            '建议提升个人能力和条件',
            '可以考虑参加一些社交活动',
            '合理设定择偶标准'
          ]
        },
        {
          min: 0,
          title: '待提升',
          description: '您的现状还有较大的提升空间，建议在多个方面继续努力。',
          advice: [
            '建议先专注于自我提升',
            '制定具体的提升计划',
            '调整心态，循序渐进'
          ]
        }
      ]
    }
  },
  computed: {
    finalScore() {
      return Math.round(this.score)
    },
    scoreLevel() {
      return this.scoreLevels.find(level => this.finalScore >= level.min) || this.scoreLevels[this.scoreLevels.length - 1]
    },
    dimensionResults() {
      const dimensions = [
        { key: 'appearance', name: '外在条件', icon: '✨' },
        { key: 'development', name: '个人发展', icon: '📈' },
        { key: 'quality', name: '内在素质', icon: '💝' },
        { key: 'family', name: '家庭背景', icon: '🏠' }
      ]

      return dimensions.map(dim => {
        const dimensionData = this.dimensionScores[dim.key] || { score: 0 }
        let score = Math.round(dimensionData.score)
        let comment = this.getScoreComment(score)
        
        return {
          name: dim.name,
          score: score,
          comment: comment,
          icon: dim.icon
        }
      })
    }
  },
  methods: {
    getScoreComment(score) {
      if (score >= 90) return '非常出色'
      if (score >= 80) return '表现优秀'
      if (score >= 70) return '良好水平'
      if (score >= 60) return '中等水平'
      return '需要提升'
    },
    restart() {
      uni.navigateBack({
        delta: 2
      })
    }
  },
  onLoad(options) {
    this.score = parseFloat(options.score)
    this.city = decodeURIComponent(options.city)
    
    // 从assessment页面接收维度分数
    try {
      this.dimensionScores = JSON.parse(decodeURIComponent(options.dimensionScores))
    } catch (e) {
      console.error('解析维度分数失败:', e)
      // 如果解析失败，使用默认值
      this.dimensionScores = {}
    }
  },
  onShareAppMessage() {
    return {
      title: `我的相亲指数得分：${this.finalScore}分！`,
      path: '/pages/index/index'
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 40rpx;
}

.score-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.score-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.score-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.score-value {
  font-size: 80rpx;
  font-weight: bold;
  color: #ff6b81;
  margin: 20rpx 0;
  display: block;
}

.score-level {
  font-size: 36rpx;
  color: #ff6b81;
  display: block;
}

.score-details {
  margin-bottom: 40rpx;
}

.detail-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.detail-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.city-adjustment {
  border-top: 1px solid #f5f5f5;
  padding-top: 20rpx;
}

.city-title {
  font-size: 26rpx;
  color: #333;
  display: block;
}

.city-note {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
  display: block;
}

.dimension-cards {
  margin-bottom: 40rpx;
  
  .dimension-card {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 16rpx rgba(255, 77, 143, 0.1);
    
    .dimension-header {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;
      
      .dimension-icon {
        font-size: 36rpx;
        margin-right: 12rpx;
      }
      
      .dimension-name {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        flex: 1;
      }
      
      .dimension-score {
        font-size: 32rpx;
        color: #ff6b81;
        font-weight: bold;
      }
    }
    
    .dimension-comment {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}

.advice-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.advice-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.advice-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: block;
  padding-left: 30rpx;
  position: relative;
}

.advice-item::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #ff6b81;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.share-btn, .restart-btn {
  width: 45%;
}

.share-btn {
  background-color: #ff6b81;
  color: #fff;
}

.restart-btn {
  background-color: #f5f5f5;
  color: #666;
}
</style>
