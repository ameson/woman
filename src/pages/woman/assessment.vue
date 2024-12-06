<template>
  <view class="container">
    <view class="progress-bar">
      <progress :percent="progress" stroke-width="3" activeColor="#ff6b81" backgroundColor="#f8f8f8" />
      <text class="progress-text">{{ currentStep }}/{{ totalSteps }}</text>
    </view>

    <view class="question-container">
      <text class="question-title">{{ currentQuestion?.title || '' }}</text>
      <text class="question-subtitle" v-if="currentQuestion?.subtitle">{{ currentQuestion.subtitle }}</text>
      
      <view class="question-content">
        <!-- 颜值评分部分 -->
        <template v-if="currentQuestion?.type === 'face'">
          <FaceUpload @score-update="onFaceScoreUpdate" />
        </template>

        <!-- 身高体重部分 -->
        <template v-else-if="currentQuestion?.type === 'physical'">
          <view class="physical-inputs">
            <view class="physical-group">
              <text class="group-label">身高</text>
              <radio-group @change="onHeightSelect" class="physical-options">
                <label 
                  class="option-item" 
                  v-for="(option, index) in currentQuestion.heightOptions" 
                  :key="'height-'+index"
                >
                  <radio 
                    :value="option.value" 
                    :checked="selectedHeight === option.value"
                  />
                  <text class="option-text">{{ option.label }}</text>
                </label>
              </radio-group>
            </view>

            <view class="physical-group">
              <text class="group-label">体重</text>
              <radio-group @change="onWeightSelect" class="physical-options">
                <label 
                  class="option-item" 
                  v-for="(option, index) in currentQuestion.weightOptions" 
                  :key="'weight-'+index"
                >
                  <radio 
                    :value="option.value" 
                    :checked="selectedWeight === option.value"
                  />
                  <text class="option-text">{{ option.label }}</text>
                </label>
              </radio-group>
            </view>
          </view>
        </template>

        <!-- 其他选择题部分 -->
        <template v-else>
          <radio-group @change="onOptionSelect" class="standard-options">
            <label 
              class="option-item" 
              v-for="(option, index) in currentQuestion?.options" 
              :key="index"
            >
              <radio 
                :value="option.value" 
                :checked="selectedOption === option.value"
              />
              <text class="option-text">{{ option.label }}</text>
            </label>
          </radio-group>
        </template>
      </view>

      <!-- 导航按钮 -->
      <view class="button-group">
        <button 
          class="nav-button prev" 
          :disabled="currentStep === 1"
          @click="prevQuestion"
        >上一题</button>
        <button 
          class="nav-button next" 
          @click="nextQuestion"
        >{{ currentStep === totalSteps ? '提交' : '下一题' }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import FaceUpload from '@/components/FaceUpload.vue'

export default {
  components: {
    FaceUpload
  },
  data() {
    return {
      currentStep: 1,
      totalSteps: 11,
      faceScore: 0,
      selectedOption: '',
      selectedHeight: '',
      selectedWeight: '',
      answers: [],
      questions: [
        {
          id: 1,
          type: 'face',
          title: '颜值评分',
          subtitle: '上传一张清晰的正面照片，用于颜值评分',
          weight: 0.2
        },
        {
          id: 2,
          type: 'physical',
          title: '身高体重小调查 📏',
          subtitle: '选一个最接近的范围就好啦～',
          heightOptions: [
            { value: '150', label: '150cm以下・小巧玲珑' },
            { value: '155', label: '150-155cm・娇小可爱' },
            { value: '160', label: '156-160cm・黄金比例' },
            { value: '165', label: '161-165cm・修长优雅' },
            { value: '170', label: '166-170cm・模特身材' },
            { value: '175', label: '171-175cm・大长腿' },
            { value: '180', label: '176cm以上・女神级' }
          ],
          weightOptions: [
            { value: '45', label: '45kg以下・纸片人' },
            { value: '50', label: '45-50kg・小仙女' },
            { value: '55', label: '51-55kg・标准美' },
            { value: '60', label: '56-60kg・健康美' },
            { value: '65', label: '61-65kg・丰腴美' },
            { value: '70', label: '66-70kg・富贵美' },
            { value: '75', label: '71kg以上・气质美' }
          ],
          weight: 0.15
        },
        {
          id: 3,
          type: 'standard',
          title: '你的年龄小秘密 🌸',
          options: [
            { value: '20', label: '20岁以下・青春花季' },
            { value: '25', label: '20-25岁・活力四射' },
            { value: '30', label: '26-30岁・魅力绽放' },
            { value: '35', label: '31-35岁・成熟优雅' },
            { value: '40', label: '36-40岁・知性优雅' },
            { value: '45', label: '41岁以上・韵味十足' }
          ],
          weight: 0.1
        },
        {
          id: 4,
          type: 'standard',
          title: '学历小调查 📚',
          options: [
            { value: '1', label: '高中及以下・实践派' },
            { value: '2', label: '大专・技能派' },
            { value: '3', label: '本科・专业派' },
            { value: '4', label: '硕士・学霸派' },
            { value: '5', label: '博士及以上・学神派' }
          ],
          weight: 0.15
        },
        {
          id: 5,
          type: 'standard',
          title: '月收入小统计 💰',
          options: [
            { value: '1', label: '3000元以下・奋斗起步期' },
            { value: '2', label: '3000-5000元・稳定发展期' },
            { value: '3', label: '5000-8000元・潜力成长期' },
            { value: '4', label: '8000-12000元・事业上升期' },
            { value: '5', label: '12000-20000元・精英人生期' },
            { value: '6', label: '20000元以上・人生赢家期' }
          ],
          weight: 0.15
        },
        {
          id: 6,
          type: 'standard',
          title: '职业小探索 💼',
          options: [
            { value: '1', label: '在校学生・知识充电期' },
            { value: '2', label: '企业职员・职场打拼期' },
            { value: '3', label: '公务员/事业单位・稳定发展期' },
            { value: '4', label: '自由职业・逐梦飞翔期' },
            { value: '5', label: '企业主/创业者・事业巅峰期' }
          ],
          weight: 0.1
        },
        {
          id: 7,
          type: 'standard',
          title: '住房小情况 🏠',
          options: [
            { value: '1', label: '暂无房产・轻资产派' },
            { value: '2', label: '与父母同住・温暖小窝派' },
            { value: '3', label: '租房・自由生活派' },
            { value: '4', label: '有按揭房・稳定生活派' },
            { value: '5', label: '全款房・人生赢家派' }
          ],
          weight: 0.1
        },
        {
          id: 8,
          type: 'standard',
          title: '家庭背景小调查 👨‍👩‍👧',
          options: [
            { value: '1', label: '普通工薪・温馨和睦派' },
            { value: '2', label: '小康之家・生活舒适派' },
            { value: '3', label: '富裕家庭・优质生活派' },
            { value: '4', label: '企业家庭・精英人脉派' }
          ],
          weight: 0.05
        },
        {
          id: 9,
          type: 'standard',
          title: '性格小解析 💝',
          options: [
            { value: '1', label: '内向安静・神秘酷girl' },
            { value: '2', label: '开朗活泼・阳光美girl' },
            { value: '3', label: '温和稳重・知性美girl' },
            { value: '4', label: '独立自主・女王范girl' }
          ],
          weight: 0.05
        },
        {
          id: 10,
          type: 'standard',
          title: '兴趣爱好小调查 ⭐',
          options: [
            { value: '1', label: '运动健身・活力美女' },
            { value: '2', label: '读书文艺・文青女神' },
            { value: '3', label: '旅游摄影・网红达人' },
            { value: '4', label: '音乐影视・艺术女神' },
            { value: '5', label: '美食烹饪・生活家女神' }
          ],
          weight: 0.05
        },
        {
          id: 11,
          type: 'standard',
          title: '理想对象小向往 💕',
          options: [
            { value: '1', label: '性格相投・灵魂伴侣派' },
            { value: '2', label: '经济条件・品质生活派' },
            { value: '3', label: '价值观一致・三观契合派' },
            { value: '4', label: '共同话题・默契情侣派' },
            { value: '5', label: '门当户对・完美组合派' }
          ],
          weight: 0.1
        }
      ]
    }
  },
  computed: {
    progress() {
      return (this.currentStep / this.totalSteps) * 100
    },
    currentQuestion() {
      const question = this.questions.find(q => q.id === this.currentStep)
      if (!question) return null
      
      // 如果已经回答过这个问题，恢复之前的选择
      const answer = this.answers.find(a => a.questionId === question.id)
      if (answer) {
        if (question.type === 'physical') {
          this.selectedHeight = answer.height
          this.selectedWeight = answer.weight
        } else {
          this.selectedOption = answer.value
        }
      }
      
      return question
    }
  },
  onLoad(options) {
    // 重置所有状态
    this.currentStep = 1
    this.answers = []
    this.selectedOption = ''
  },
  methods: {
    onOptionSelect(e) {
      this.selectedOption = e.detail.value
      const existingAnswer = this.answers.find(a => a.questionId === this.currentQuestion.id)
      
      if (existingAnswer) {
        existingAnswer.value = this.selectedOption
      } else {
        this.answers.push({
          questionId: this.currentQuestion.id,
          value: this.selectedOption,
          weight: this.currentQuestion.weight
        })
      }
      
      if (this.currentStep < this.totalSteps) {
        setTimeout(() => this.nextQuestion(), 300)
      }
    },

    onHeightSelect(e) {
      this.selectedHeight = e.detail.value
      this.updatePhysicalScore()
    },

    onWeightSelect(e) {
      this.selectedWeight = e.detail.value
      this.updatePhysicalScore()
    },

    updatePhysicalScore() {
      if (!this.selectedHeight || !this.selectedWeight) return

      const height = parseFloat(this.selectedHeight)
      const weight = parseFloat(this.selectedWeight)
      
      // BMI计算
      const heightInMeters = height / 100
      const bmi = weight / (heightInMeters * heightInMeters)
      
      // BMI评分标准（女性）
      let score = 0
      if (bmi < 18.5) {
        // 偏瘦
        score = 70 + (bmi - 16) * 10
      } else if (bmi <= 23.9) {
        // 正常范围
        score = 85 + (23.9 - bmi) * 3
      } else if (bmi <= 27.9) {
        // 过重
        score = 70 - (bmi - 23.9) * 5
      } else {
        // 肥胖
        score = 50 - (bmi - 27.9) * 5
      }
      
      // 限制分数范围
      score = Math.max(0, Math.min(100, score))
      
      const existingAnswer = this.answers.find(a => a.questionId === this.currentQuestion.id)
      if (existingAnswer) {
        existingAnswer.height = this.selectedHeight
        existingAnswer.weight = this.selectedWeight
        existingAnswer.score = score
      } else {
        this.answers.push({
          questionId: this.currentQuestion.id,
          height: this.selectedHeight,
          weight: this.selectedWeight,
          score: score,
          weight: this.currentQuestion.weight
        })
      }
    },

    validateNumberInput() {
      if (this.currentQuestion.type === 'physical') {
        if (!this.selectedHeight || !this.selectedWeight) {
          uni.showToast({
            title: '请选择身高和体重',
            icon: 'none'
          })
          return false
        }
        return true
      }
      
      if (!this.selectedOption) {
        uni.showToast({
          title: '请选择一个选项',
          icon: 'none'
        })
        return false
      }
      return true
    },

    calculatePhysicalScore(value) {
      // 将选项值转换为分数
      const valueNum = parseFloat(value)
      let score = 0
      
      if (value === '1') score = 60
      else if (value === '2') score = 70
      else if (value === '3') score = 80
      else if (value === '4') score = 90
      else if (value === '5') score = 95
      else if (value === '6') score = 100
      
      return score
    },

    calculateScores() {
      let totalScore = 0
      let totalWeight = 0
      
      this.answers.forEach(answer => {
        let score = 0
        if (answer.questionId === 1) {
          // 颜值评分题目使用faceScore
          score = this.faceScore
        } else if (answer.questionId === 2) {
          // 身高体重题目使用BMI计算的分数
          score = answer.score
        } else {
          // 其他题目根据选项计算分数
          score = this.calculatePhysicalScore(answer.value)
        }
        
        totalScore += score * answer.weight
        totalWeight += answer.weight
      })
      
      // 计算加权平均分
      return totalWeight > 0 ? totalScore / totalWeight : 0
    },

    getScoreComment(score) {
      if (score >= 90) return '完美女神✨ 这项简直就是你的超能力！'
      if (score >= 80) return '超级优秀💫 这一方面你已经很出色啦～'
      if (score >= 70) return '很不错哦💝 继续保持这个状态！'
      if (score >= 60) return '有潜力呢💪 稍加努力就能更出色～'
      return '潜力股✨ 这方面还可以继续加油哦！'
    },

    prevQuestion() {
      if (this.currentStep > 1) {
        this.currentStep--
        this.selectedOption = ''
        this.selectedHeight = ''
        this.selectedWeight = ''
      }
    },

    nextQuestion() {
      // 如果是颜值评分步骤，检查是否已完成
      if (this.currentStep === 1 && !this.faceScore) {
        uni.showToast({
          title: '请先完成颜值评分',
          icon: 'none'
        })
        return
      }

      if (!this.validateNumberInput()) return
      
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
        this.selectedOption = ''
        this.selectedHeight = ''
        this.selectedWeight = ''
      } else {
        this.submitAssessment()
      }
    },

    onFaceScoreUpdate(score) {
      this.faceScore = score
      // 记录颜值评分答案
      this.answers.push({
        questionId: 1,
        value: score,
        score: score,
        weight: 0.2
      })
      this.nextQuestion()
    },

    submitAssessment() {
      const totalScore = this.calculateScores()
      
      // 获取城市等级信息
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      const city = prevPage?.data?.selectedCity?.level || '一线城市'
      
      // 根据城市等级调整分数
      let cityAdjustment = 0
      switch (city) {
        case '一线城市': cityAdjustment = -5; break
        case '新一线城市': cityAdjustment = -2; break
        case '二线城市': cityAdjustment = 0; break
        case '三线城市': cityAdjustment = 2; break
        default: cityAdjustment = 5
      }
      
      const adjustedScore = Math.max(0, Math.min(100, totalScore + cityAdjustment))
      
      // 跳转到结果页面，添加颜值分数
      const data = {
        totalScore: adjustedScore,
        faceScore: this.faceScore,
        city: city,
        dimensions: this.answers.map(answer => ({
          name: this.questions.find(q => q.id === answer.questionId)?.title || '',
          score: answer.score || this.calculatePhysicalScore(answer.value),
          weight: answer.weight
        }))
      }
      
      uni.redirectTo({
        url: `/pages/woman/result?data=${encodeURIComponent(JSON.stringify(data))}`
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 30rpx;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.progress-bar {
  margin-bottom: 30rpx;
  position: relative;
  
  .progress-text {
    position: absolute;
    right: 0;
    top: -40rpx;
    font-size: 24rpx;
    color: #666;
  }
}

.question-container {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.question-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
  text-align: center;
}

.question-subtitle {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
  display: block;
  text-align: center;
}

.question-content {
  margin: 40rpx 0;
}

.standard-options {
  .option-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    margin-bottom: 20rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;
    transition: all 0.3s;
    
    &:active {
      background-color: #f0f0f0;
    }
    
    .option-text {
      margin-left: 20rpx;
      font-size: 28rpx;
      color: #333;
    }
  }
}

.physical-inputs {
  .physical-group {
    margin-bottom: 40rpx;
    
    .group-label {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .physical-options {
      display: flex;
      flex-direction: column;
      gap: 20rpx;
      
      .option-item {
        display: flex;
        align-items: center;
        padding: 20rpx;
        background-color: #f8f8f8;
        border-radius: 8rpx;
        
        .option-text {
          margin-left: 20rpx;
          font-size: 28rpx;
          color: #333;
        }
      }
    }
  }
}

.button-group {
  margin-top: 60rpx;
  display: flex;
  justify-content: space-between;
  padding: 0 20rpx;
}

.nav-button {
  width: 240rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 32rpx;
  border: none;
  
  &.prev {
    background-color: #f0f0f0;
    color: #666;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  &.next {
    background-color: #ff6b81;
    color: #fff;
    
    &:disabled {
      background-color: #ffb3bd;
      cursor: not-allowed;
    }
  }
}

</style>
