<template>
  <view class="container">
    <canvas canvas-id="shareCanvas" class="share-canvas"></canvas>
    <view class="result-container">
      <view id="share-container" class="share-content">
        <view class="score-card">
          <view class="score-header">
            <text class="score-title">✨相亲指数---魅力得分 ✨</text>
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
              <text class="face-score-title">颜值评分：{{ Math.round(faceScore * 100) }}分</text>
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
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="share-btn" @click="shareScore">分享成绩</button>
        <button class="restart-btn" @click="restart">重新测试</button>
      </view>
    </view>
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
      // 颜值评分权重为20%
      const faceScoreWeight = 0.2
      const otherScoreWeight = 0.8
      
      // 颜值评分已经是0-1，需要转换为百分制
      const faceScoreContribution = (this.faceScore * 100) * faceScoreWeight
      
      // 其他维度得分
      const otherScoreContribution = this.rawScore * otherScoreWeight
      
      console.log('=== 最终得分计算 ===');
      console.log(`颜值得分(${this.faceScore * 100})，权重(${faceScoreWeight})，贡献：${faceScoreContribution}`);
      console.log(`其他维度得分(${this.rawScore})，权重(${otherScoreWeight})，贡献：${otherScoreContribution}`);
      
      // 确保最终分数在0-100之间
      const score = Math.round(faceScoreContribution + otherScoreContribution)
      console.log(`最终得分：${score}`);
      return Math.min(100, Math.max(0, score))
    },
    scoreLevel() {
      return this.scoreLevels.find(level => this.finalScore >= level.min)
    },
    dimensionResults() {
      return this.dimensions
        .filter(dim => 
          !dim.name.includes('年龄') && 
          !dim.name.includes('兴趣爱好') && 
          !dim.name.includes('理想对象')
        )
        .map(dim => ({
          name: dim.name,
          score: Math.round(dim.score),
          weight: dim.weight
        }))
        .sort((a, b) => b.score - a.score)
    }
  },
  mounted() {
    // 加载html2canvas
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.onload = () => {
      console.log('html2canvas loaded');
    };
    document.head.appendChild(script);
  },
  methods: {
    async shareScore() {
      try {
        const ctx = uni.createCanvasContext('shareCanvas', this);
        const canvasWidth = 375;
        const canvasHeight = 800;
        
        // 设置背景色
        const grd = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        grd.addColorStop(0, '#fff5f5');
        grd.addColorStop(1, '#fff5f5');
        ctx.setFillStyle(grd);
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // 绘制标题
        ctx.setFontSize(24);
        ctx.setFillStyle('#ff4d6a');
        ctx.setTextAlign('center');
        ctx.fillText('相亲指数---你的魅力指数', canvasWidth/2, 50);
        
        // 绘制分数
        ctx.setFontSize(120);
        ctx.setFillStyle('#ff4d6a');
        ctx.fillText(this.finalScore, canvasWidth/2, 180);
        
        // 绘制类型
        ctx.setFontSize(28);
        const starEmoji = '⭐';
        ctx.fillText(starEmoji + ' ' + this.scoreLevel.title + ' ' + starEmoji, canvasWidth/2, 240);
        
        // 绘制关键词标签
        const tags = this.scoreLevel.keywords;
        const tagHeight = 36;
        const tagPadding = 20;
        const tagSpacing = 15;
        let currentX = 20;
        let currentY = 280;
        
        ctx.setFontSize(16);
        tags.forEach((tag, index) => {
          const textWidth = ctx.measureText(tag).width;
          const tagWidth = textWidth + tagPadding * 2;
          
          // 如果当前行放不下，换行
          if (currentX + tagWidth > canvasWidth - 20) {
            currentX = 20;
            currentY += tagHeight + 10;
          }
          
          // 绘制标签背景
          ctx.setFillStyle('#ffd4dc');
          ctx.fillRect(currentX, currentY, tagWidth, tagHeight);
          
          // 绘制标签文字
          ctx.setFillStyle('#ff4d6a');
          ctx.setTextAlign('center');
          ctx.fillText(tag, currentX + tagWidth/2, currentY + 25);
          
          currentX += tagWidth + tagSpacing;
        });
        
        // 绘制评语
        currentY += tagHeight + 30;
        ctx.setFontSize(16);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('left');
        const text = this.scoreLevel.description;
        this.drawMultilineText(ctx, text, 20, currentY, canvasWidth - 40, 24);
        
        // 绘制城市信息
        currentY += 100;
        ctx.setFontSize(16);
        ctx.fillText('所在城市：' + this.city, 20, currentY);
        currentY += 25;
        ctx.setFontSize(14);
        ctx.setFillStyle('#999999');
        ctx.fillText('* 已根据城市特点调整评分标准', 20, currentY);
        
        // 绘制颜值评分
        currentY += 40;
        ctx.setFontSize(16);
        ctx.setFillStyle('#333333');
        ctx.fillText('颜值评分：' + Math.round(this.faceScore * 100) + '分', 20, currentY);
        currentY += 25;
        ctx.setFontSize(14);
        ctx.setFillStyle('#999999');
        ctx.fillText('* 已将颜值评分计入总分', 20, currentY);
        
        // 加载并绘制二维码
        const qrImage = await this.getImageInfo('/static/qr.jpg');
        const qrSize = 120;
        const qrX = (canvasWidth - qrSize) / 2;
        currentY += 60;
        ctx.drawImage(qrImage.path, qrX, currentY, qrSize, qrSize);
        
        // 绘制二维码说明
        currentY += qrSize + 30;
        ctx.setFontSize(14);
        ctx.setTextAlign('center');
        ctx.setFillStyle('#666666');
        ctx.fillText('扫描二维码生成你的相亲指数', canvasWidth/2, currentY);
        
        ctx.draw(false, () => {
          setTimeout(() => {
            uni.canvasToTempFilePath({
              canvasId: 'shareCanvas',
              fileType: 'png',
              quality: 1,
              success: (res) => {
                const base64 = res.tempFilePath;
                const a = document.createElement('a');
                if (base64.startsWith('data:image')) {
                  a.href = base64;
                } else {
                  a.href = 'data:image/png;base64,' + base64;
                }
                a.download = '相亲指数_' + new Date().getTime() + '.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                uni.showToast({
                  title: '图片已开始下载',
                  icon: 'success'
                });
              },
              fail: (err) => {
                console.error('生成图片失败:', err);
                uni.showToast({
                  title: '生成图片失败',
                  icon: 'none'
                });
              }
            });
          }, 300);
        });
      } catch (error) {
        console.error('分享图片生成失败:', error);
        uni.showToast({
          title: '分享图片生成失败',
          icon: 'none'
        });
      }
    },
    
    // 辅助方法：获取图片信息
    getImageInfo(src) {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: src,
          success: resolve,
          fail: reject
        });
      });
    },
    
    // 辅助方法：绘制多行文本
    drawMultilineText(ctx, text, x, y, maxWidth, lineHeight) {
      let chars = text.split('');
      let line = '';
      
      for (let i = 0; i < chars.length; i++) {
        let testLine = line + chars[i];
        let metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, x, y);
          line = chars[i];
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    },
    
    getScoreComment(score) {
      // 检查是否是年龄维度
      if (this.dimensions.find(d => d.score === score && d.name.includes('年龄'))) {
        if (score >= 90) return '黄金年龄 | 正处于适婚年龄的黄金阶段，各方面条件都很成熟，是组建家庭的理想时期。'
        if (score >= 80) return '理想年龄 | 目前的年龄阶段很不错，各方面发展都比较稳定，适合考虑终身大事。'
        if (score >= 70) return '适婚年龄 | 这个年龄段有自己独特的优势，可以更从容地规划感情和未来。'
        if (score >= 60) return '年龄尚可 | 这个年龄段也有其特别之处，建议在感情方面多一些耐心和信心。'
        return '年龄偏低 | 年龄还比较年轻，可以把重心放在个人发展上，感情的事不用着急。'
      }
      // 排除兴趣爱好和理想对象
      const currentDimension = this.dimensions.find(d => d.score === score)
      if (currentDimension && 
          (currentDimension.name.includes('兴趣爱好') || 
           currentDimension.name.includes('理想对象'))) {
        return '这是一个有趣的维度，但不会影响你的整体魅力指数。'
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

.action-buttons {
  position: fixed;
  bottom: 40rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0 40rpx;
  
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.share-btn, .restart-btn {
  width: 280rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  color: #fff;
  text-align: center;
  
}

.share-btn {
  background: linear-gradient(45deg, #FF9A9E, #FAD0C4);
}

.restart-btn {
  background: linear-gradient(45deg, #A6C1EE, #86A8E7);
}

.share-canvas {
  position: fixed;
  left: -9999px;
  width: 100%;
  height: 100%;
}

.share-content {
  background: #ffffff;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-bottom: 120rpx; /* 为底部按钮留出空间 */
}

.share-canvas {
  position: fixed;
  left: -9999px;
  width: 750rpx;
  height: 1334rpx;
  z-index: -1;
  visibility: hidden;
}
</style>
