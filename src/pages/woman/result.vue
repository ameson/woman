<template>
  <view class="container">
    <view class="score-card">
      <view class="score-header">
        <text class="score-title">✨相亲指数---你的魅力指数 ✨</text>
        <text class="score-value">{{ finalScore }}</text>
        <text class="score-level">{{ scoreLevel.title }}</text>
      </view>
      
      <view class="keywords-container">
        <text class="keywords-title">你的关键词</text>
        <view class="keywords-list">
          <text v-for="(keyword, index) in scoreLevel.keywords" 
                :key="index" 
                class="keyword-tag">
            {{ keyword }}
          </text>
        </view>
      </view>
      
      <view class="score-details">
        <text class="detail-title">解读小贴士</text>
        <text class="detail-text">{{ scoreLevel.description }}</text>
      </view>

      <view class="city-adjustment">
        <text class="city-title">所在城市：{{ city }}</text>
        <text class="city-note">* 已根据城市特点调整评分标准</text>
      </view>

      <view class="face-score-section">
        <view class="face-score-result">
          <text class="face-score-title">颜值评分：{{ faceScore }}分</text>
          <text class="face-score-note">* 已将颜值评分计入总分</text>
        </view>
      </view>

      <view class="follow-us">
        <view class="follow-content">
          <text class="follow-title">关注我们</text>
          <image class="qr-code" src="@/static/qr.jpg" mode="aspectFit"></image>
          <text class="follow-desc">扫码关注获取更多资讯</text>
        </view>
      </view>
    </view>

    

    <view class="dimension-cards">
      <view v-for="(dimension, index) in dimensionResults" :key="index" class="dimension-card">
        <view class="dimension-header">
          <text class="dimension-title">{{ dimension.name }}</text>
          <text class="dimension-score">{{ dimension.score }}分</text>
        </view>
        <text class="dimension-comment">{{ getScoreComment(dimension.score) }}</text>
      </view>
    </view>

    <button class="restart-button" @click="restart">重新测试</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      city: '',
      rawScore: 0,
      faceScore: 0,
      dimensions: [],
      scoreLevels: [
        {
          min: 90,
          title: '✨ 女神级别',
          description: '哇！你就是行走的锦鲤本鲤了！高学历、高颜值、高能力，简直就是别人家的完美女友。建议你赶紧出道，不然优质男嘉宾要排队到天荒地老啦～',
          keywords: ['锦鲤体质', '事业开挂', '魅力四射', '人生赢家']
        },
        {
          min: 80,
          title: '💝 女王气质',
          description: '独立、优秀又迷人，你就是行走的人生教科书！事业和生活都被你经营得井井有条，只是偶尔也要给别人一个保护你的机会哦～',
          keywords: ['独立自主', '事业有成', '生活品质派', '感性理性派']
        },
        {
          min: 70,
          title: '🌟 小仙女型',
          description: '温柔可人又不失个性，是大家都喜欢的暖心小太阳！虽然生活中还有一些小目标要实现，但你的潜力值可是满分呢～',
          keywords: ['暖心治愈', '潜力股', '温柔可人', '积极向上']
        },
        {
          min: 60,
          title: '🌸 花季少女',
          description: '青春活力、朝气蓬勃，你就像一朵正在绽放的花儿！虽然现在还在成长阶段，但只要继续保持这份热情，你的魅力值很快就能升级哦～',
          keywords: ['活力四射', '成长潜力', '元气满满', '真诚可爱']
        },
        {
          min: 0,
          title: '🌱 萌芽宝贝',
          description: '每个人都是独一无二的小宇宙！虽然现在还在努力追寻自己的方向，但只要坚持下去，你一定会成长为最闪亮的那颗星星✨',
          keywords: ['真实率真', '积极乐观', '成长空间', '潜力无限']
        }
      ]
    }
  },
  computed: {
    finalScore() {
      // 将颜值评分计入总分，权重为20%
      const faceScoreWeight = 0.2
      const otherScoreWeight = 0.8
      const faceScoreContribution = this.faceScore * 10 * faceScoreWeight // 将1-10分转换为百分制
      const otherScoreContribution = this.rawScore * otherScoreWeight
      return Math.round(faceScoreContribution + otherScoreContribution)
    },
    scoreLevel() {
      return this.scoreLevels.find(level => this.finalScore >= level.min)
    },
    dimensionResults() {
      return this.dimensions
        .filter(dim => !dim.name.includes('年龄')) // 过滤掉年龄维度
        .map(dim => ({
          name: dim.name,
          score: Math.round(dim.score),
          weight: dim.weight
        }))
        .sort((a, b) => b.score - a.score)
    }
  },
  methods: {
    getScoreComment(score) {
      // 检查是否是年龄维度
      if (this.dimensions.find(d => d.score === score && d.name.includes('年龄'))) {
        if (score >= 90) return '黄金年龄 | 正处于适婚年龄的黄金阶段，各方面条件都很成熟，是组建家庭的理想时期。'
        if (score >= 80) return '理想年龄 | 目前的年龄阶段很不错，各方面发展都比较稳定，适合考虑终身大事。'
        if (score >= 70) return '适婚年龄 | 这个年龄段有自己独特的优势，可以更从容地规划感情和未来。'
        if (score >= 60) return '年龄尚可 | 这个年龄段也有其特别之处，建议在感情方面多一些耐心和信心。'
        return '年龄偏低 | 年龄还比较年轻，可以把重心放在个人发展上，感情的事不用着急。'
      }
      // 其他维度保持原有评价
      if (score >= 90) return '非常出色 | 这一方面你表现极其优秀，是你的一大亮点，建议继续保持并发挥这份优势，让自己更加闪耀。'
      if (score >= 80) return '很有优势 | 在这个方面你有很强的竞争力，适当展现这些特质会让你在相亲中脱颖而出，建议继续发扬。'
      if (score >= 70) return '表现不错 | 这方面基础扎实，还有提升空间。建议多关注这方面的自我提升，让自己变得更加出色。'
      if (score >= 60) return '有待发展 | 这一维度还有较大提升空间，建议多投入一些时间和精力，相信通过努力一定会有显著进步。'
      return '潜力待发 | 这个方面需要更多关注，不妨制定一个提升计划，循序渐进地改善，每一点进步都很重要。'
    },
    restart() {
      uni.redirectTo({
        url: '/pages/woman/index'
      })
    }
  },
  onLoad(options) {
    if (options.data) {
      const data = JSON.parse(decodeURIComponent(options.data))
      this.city = data.city
      this.rawScore = data.totalScore
      this.faceScore = data.faceScore || 0
      this.dimensions = data.dimensions
    } else {
      uni.showToast({
        title: '数据加载失败',
        icon: 'none'
      })
    }
  },
  onShareAppMessage() {
    return {
      title: `我的相亲指数得分：${this.finalScore}分（${this.scoreLevel.title}）`,
      path: '/pages/index/index'
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 20px;
  background-color: #fff5f8;
  min-height: 100vh;
}

.score-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(255, 107, 129, 0.15);

  .score-header {
    text-align: center;
    margin-bottom: 25px;

    .score-title {
      font-size: 20px;
      color: #ff6b81;
      margin-bottom: 15px;
      display: block;
    }

    .score-value {
      font-size: 56px;
      color: #ff6b81;
      font-weight: bold;
      margin: 10px 0;
      display: block;
    }

    .score-level {
      font-size: 28px;
      color: #ff6b81;
      font-weight: bold;
      display: block;
    }
  }

  .keywords-container {
    margin: 25px 0;
    text-align: center;

    .keywords-title {
      font-size: 18px;
      color: #333;
      margin-bottom: 15px;
      display: block;
    }

    .keywords-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;

      .keyword-tag {
        background-color: #fff0f3;
        color: #ff6b81;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
      }
    }
  }

  .score-details {
    margin-bottom: 25px;

    .detail-title {
      font-size: 18px;
      color: #333;
      margin-bottom: 12px;
      display: block;
    }

    .detail-text {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
    }
  }

  .city-adjustment {
    border-top: 1px solid #ffe6eb;
    padding-top: 15px;

    .city-title {
      font-size: 14px;
      color: #333;
      display: block;
      margin-bottom: 5px;
    }

    .city-note {
      font-size: 12px;
      color: #999;
    }
  }

  .face-score-section {
    margin: 20rpx 0;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .face-score-result {
      text-align: center;
      padding: 20rpx;

      .face-score-title {
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
        display: block;
        margin-bottom: 10rpx;
      }

      .face-score-note {
        font-size: 24rpx;
        color: #999;
      }
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
}

.dimension-cards {
  .dimension-card {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 4px 12px rgba(255, 107, 129, 0.1);

    .dimension-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .dimension-title {
        font-size: 16px;
        color: #333;
        font-weight: bold;
      }

      .dimension-score {
        font-size: 16px;
        color: #ff6b81;
        font-weight: bold;
      }
    }

    .dimension-comment {
      font-size: 14px;
      color: #666;
    }
  }
}

.restart-button {
  background-color: #ff6b81;
  color: #ffffff;
  border-radius: 25px;
  padding: 15px 0;
  width: 80%;
  margin: 30px auto;
  font-size: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(255, 107, 129, 0.2);

  &:active {
    opacity: 0.9;
  }
}
</style>
