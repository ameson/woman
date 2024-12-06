<template>
  <view class="container">
    <view class="progress-bar">
      <progress :percent="progress" stroke-width="3" activeColor="#ff6b81" backgroundColor="#f8f8f8" />
      <text class="progress-text">{{ currentStep }}/{{ totalSteps }}</text>
    </view>

    <view class="question-container">
      <text class="question-title">{{ currentQuestion?.title || '' }}</text>
      <text class="question-subtitle" v-if="currentQuestion?.subtitle">{{ currentQuestion.subtitle }}</text>
      
      <view class="options">
        <template v-if="currentQuestion?.type === 'physical'">
          <view class="physical-inputs">
            <view class="physical-group">
              <text class="group-label">身高</text>
              <radio-group @change="onHeightSelect" class="physical-options">
                <label 
                  class="option-item" 
                  v-for="(option, index) in currentQuestion.heightOptions" 
                  :key="'height-'+index"
                  :class="{ 'option-selected': selectedHeight === index.toString() }"
                >
                  <radio :value="index.toString()" :checked="selectedHeight === index.toString()" color="#ff6b81" />
                  <view class="option-content">
                    <text class="option-text">{{ option.text }}</text>
                  </view>
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
                  :class="{ 'option-selected': selectedWeight === index.toString() }"
                >
                  <radio :value="index.toString()" :checked="selectedWeight === index.toString()" color="#ff6b81" />
                  <view class="option-content">
                    <text class="option-text">{{ option.text }}</text>
                  </view>
                </label>
              </radio-group>
            </view>
          </view>
        </template>
        <template v-else-if="currentQuestion?.type === 'number'">
          <view class="number-input">
            <input 
              type="digit" 
              v-model="selectedOption"
              :placeholder="currentQuestion.placeholder"
              class="input-field"
            />
            <text class="input-unit">{{ currentQuestion.unit }}</text>
          </view>
        </template>
        <radio-group @change="onOptionSelect" v-else>
          <label 
            class="option-item" 
            v-for="(option, index) in (currentQuestion?.options || [])" 
            :key="index"
            :class="{ 'option-selected': selectedOption === index.toString() }"
          >
            <radio :value="index.toString()" :checked="selectedOption === index.toString()" color="#ff6b81" />
            <view class="option-content">
              <text class="option-text">{{ option.text }}</text>
              <text class="option-desc" v-if="option.desc">{{ option.desc }}</text>
            </view>
          </label>
        </radio-group>
      </view>
    </view>

    <view class="button-group">
      <button class="prev-btn" @click="prevQuestion" v-if="currentStep > 1">上一题</button>
      <button class="next-btn" :disabled="!selectedOption && currentQuestion.type !== 'physical'" @click="nextQuestion">
        {{ currentStep === totalSteps ? '完成评估' : '下一题' }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      totalSteps: 12,
      selectedOption: '',
      selectedHeight: '',
      selectedWeight: '',
      city: '',
      answers: [],
      questions: [
        // 0. 身高体重（10分）
        {
          type: 'physical',
          dimension: 'physical',
          subdimension: 'body',
          weight: 10,
          title: '您的身高体重是？',
          subtitle: '请选择您的身高和体重范围',
          heightOptions: [
            { text: '150cm以下', value: [0, 150] },
            { text: '150-155cm', value: [150, 155] },
            { text: '155-160cm', value: [155, 160] },
            { text: '160-165cm', value: [160, 165] },
            { text: '165-170cm', value: [165, 170] },
            { text: '170-175cm', value: [170, 175] },
            { text: '175cm以上', value: [175, 999] }
          ],
          weightOptions: [
            { text: '40kg以下', value: [0, 40] },
            { text: '40-45kg', value: [40, 45] },
            { text: '45-50kg', value: [45, 50] },
            { text: '50-55kg', value: [50, 55] },
            { text: '55-60kg', value: [55, 60] },
            { text: '60-65kg', value: [60, 65] },
            { text: '65-70kg', value: [65, 70] },
            { text: '70kg以上', value: [70, 999] }
          ]
        },
        // 1. 外在条件（35分）
        // 1.1 颜值评分（20分）
        {
          type: 'single',
          dimension: 'appearance',
          subdimension: 'face',
          weight: 20,
          title: '您的五官特点是？',
          subtitle: '了解您的五官协调程度',
          options: [
            { text: '五官精致立体，非常协调', value: 100, desc: '五官精致，比例协调' },
            { text: '五官较为精致，比较协调', value: 90, desc: '五官较好，整体协调' },
            { text: '五官普通，基本协调', value: 80, desc: '五官普通，协调性一般' },
            { text: '五官略显平淡', value: 70, desc: '五官特点不够突出' },
            { text: '五官不太协调', value: 60, desc: '五官协调性待提升' }
          ]
        },
        // 1.2 身材比例（10分）
        {
          type: 'single',
          dimension: 'appearance',
          subdimension: 'body',
          weight: 10,
          title: '您的身材体型是？',
          subtitle: '了解您的身材比例',
          options: [
            { text: '身材修长，比例完美', value: 100, desc: '黄金比例，体型优美' },
            { text: '身材匀称，比例协调', value: 90, desc: '体型匀称，整体协调' },
            { text: '身材适中，比例一般', value: 80, desc: '标准体型，比例正常' },
            { text: '体型略有不足', value: 70, desc: '体型有待改善' },
            { text: '体型需要调整', value: 60, desc: '建议进行体型管理' }
          ]
        },
        // 1.3 形象管理（5分）
        {
          type: 'single',
          dimension: 'appearance',
          subdimension: 'image',
          weight: 5,
          title: '您平时的形象管理情况？',
          subtitle: '了解您的个人形象维护习惯',
          options: [
            { text: '非常注重，定期护理', value: 100, desc: '高度重视个人形象' },
            { text: '比较注重，经常打理', value: 90, desc: '重视形象管理' },
            { text: '一般注重，基本打理', value: 80, desc: '基本注意形象' },
            { text: '较少关注，简单打理', value: 70, desc: '形象管理有待加强' },
            { text: '很少关注，随意打理', value: 60, desc: '建议加强形象管理' }
          ]
        },
        // 2. 个人发展（30分）
        // 2.1 学历背景（10分）
        {
          type: 'single',
          dimension: 'development',
          subdimension: 'education',
          weight: 10,
          title: '您的最高学历是？',
          subtitle: '了解您的教育背景',
          options: [
            { text: '博士及以上', value: 100, desc: '最高学历' },
            { text: '硕士', value: 90, desc: '研究生学历' },
            { text: '重点本科', value: 85, desc: '优质本科教育' },
            { text: '普通本科', value: 80, desc: '本科学历' },
            { text: '大专及以下', value: 70, desc: '专科学历' }
          ]
        },
        // 2.2 职业发展（10分）
        {
          type: 'single',
          dimension: 'development',
          subdimension: 'career',
          weight: 10,
          title: '您目前的职业发展阶段是？',
          subtitle: '了解您的职业发展状况',
          options: [
            { text: '高级管理岗位', value: 100, desc: '管理层职位' },
            { text: '中层管理岗位', value: 90, desc: '中层管理者' },
            { text: '专业技术岗位', value: 85, desc: '专业人才' },
            { text: '普通工作岗位', value: 80, desc: '基层岗位' },
            { text: '待业/创业初期', value: 70, desc: '职业起步阶段' }
          ]
        },
        // 2.3 经济实力（10分）
        {
          type: 'single',
          dimension: 'development',
          subdimension: 'finance',
          weight: 10,
          title: '您的月收入水平是？',
          subtitle: '了解您的经济实力',
          options: [
            { text: '3万以上', value: 100, desc: '收入优秀' },
            { text: '1.5-3万', value: 90, desc: '收入良好' },
            { text: '1-1.5万', value: 80, desc: '收入中等' },
            { text: '6千-1万', value: 70, desc: '收入一般' },
            { text: '6千以下', value: 60, desc: '收入待提升' }
          ]
        },
        // 3. 内在素质（20分）
        // 3.1 生活习惯（10分）
        {
          type: 'single',
          dimension: 'quality',
          subdimension: 'lifestyle',
          weight: 10,
          title: '您的生活作息情况是？',
          subtitle: '了解您的生活规律程度',
          options: [
            { text: '作息非常规律，生活健康', value: 100, desc: '生活非常规律' },
            { text: '作息比较规律，较为健康', value: 90, desc: '生活比较规律' },
            { text: '作息基本规律，还算健康', value: 80, desc: '生活基本规律' },
            { text: '作息不太规律，较少运动', value: 70, desc: '生活欠规律' },
            { text: '作息不规律，缺乏运动', value: 60, desc: '建议调整作息' }
          ]
        },
        // 3.2 家务能力（5分）
        {
          type: 'single',
          dimension: 'quality',
          subdimension: 'housework',
          weight: 5,
          title: '您的家务处理能力如何？',
          subtitle: '了解您的生活自理能力',
          options: [
            { text: '精通烹饪，家务安排有序', value: 100, desc: '家务能力强' },
            { text: '会做饭菜，家务处理得当', value: 90, desc: '家务能力好' },
            { text: '基本会做饭，能处理家务', value: 80, desc: '家务能力一般' },
            { text: '简单烹饪，家务处理一般', value: 70, desc: '家务能力待提升' },
            { text: '不太会做饭，家务较少做', value: 60, desc: '建议提升家务能力' }
          ]
        },
        // 3.3 性格特质（5分）
        {
          type: 'single',
          dimension: 'quality',
          subdimension: 'personality',
          weight: 5,
          title: '您的性格特点是？',
          subtitle: '了解您的性格特质',
          options: [
            { text: '开朗大方，性格成熟', value: 100, desc: '性格非常好' },
            { text: '温和友善，为人随和', value: 90, desc: '性格较好' },
            { text: '性格一般，偶有情绪', value: 80, desc: '性格中等' },
            { text: '略显内向，情绪波动', value: 70, desc: '性格待改善' },
            { text: '性格较为敏感', value: 60, desc: '建议调节性格' }
          ]
        },
        // 4. 家庭背景（15分）
        // 4.1 家庭条件（8分）
        {
          type: 'single',
          dimension: 'family',
          subdimension: 'condition',
          weight: 8,
          title: '您家庭的经济条件是？',
          subtitle: '了解您的家庭经济状况',
          options: [
            { text: '家庭富裕，经济优越', value: 100, desc: '家庭条件优秀' },
            { text: '家庭殷实，经济稳定', value: 90, desc: '家庭条件良好' },
            { text: '家庭小康，收入一般', value: 80, desc: '家庭条件中等' },
            { text: '家庭普通，收入一般', value: 70, desc: '家庭条件一般' },
            { text: '家庭困难，收入较低', value: 60, desc: '家庭条件待改善' }
          ]
        },
        // 4.2 家庭关系（7分）
        {
          type: 'single',
          dimension: 'family',
          subdimension: 'relationship',
          weight: 7,
          title: '您的家庭关系如何？',
          subtitle: '了解您的家庭氛围',
          options: [
            { text: '家庭和睦，关系融洽', value: 100, desc: '家庭关系优秀' },
            { text: '家庭和谐，偶有分歧', value: 90, desc: '家庭关系良好' },
            { text: '家庭一般，有代沟', value: 80, desc: '家庭关系一般' },
            { text: '家庭关系较紧张', value: 70, desc: '家庭关系待改善' },
            { text: '家庭关系不太好', value: 60, desc: '建议改善家庭关系' }
          ]
        }
      ]
    }
  },
  computed: {
    progress() {
      return (this.currentStep / this.totalSteps) * 100
    },
    currentQuestion() {
      if (this.currentStep < 1 || this.currentStep > this.questions.length) {
        return {
          title: '',
          subtitle: '',
          options: []
        }
      }
      return this.questions[this.currentStep - 1]
    }
  },
  onLoad(options) {
    if (options.city) {
      this.city = decodeURIComponent(options.city)
    }
  },
  methods: {
    onOptionSelect(e) {
      if (this.currentQuestion.type === 'number') {
        // For number type, validation happens in real-time
        return;
      }
      // For radio options
      this.selectedOption = e.detail.value;
      const option = this.currentQuestion.options[parseInt(this.selectedOption)];
      const answer = {
        step: this.currentStep,
        dimension: this.currentQuestion.dimension,
        subdimension: this.currentQuestion.subdimension,
        weight: this.currentQuestion.weight,
        value: option.value
      };
      this.answers[this.currentStep - 1] = answer;
    },
    
    onHeightSelect(e) {
      this.selectedHeight = e.detail.value;
      this.updatePhysicalScore();
    },
    
    onWeightSelect(e) {
      this.selectedWeight = e.detail.value;
      this.updatePhysicalScore();
    },
    
    updatePhysicalScore() {
      if (!this.selectedHeight || !this.selectedWeight || !this.currentQuestion) {
        return;
      }
      
      const heightOption = this.currentQuestion.heightOptions[parseInt(this.selectedHeight)];
      const weightOption = this.currentQuestion.weightOptions[parseInt(this.selectedWeight)];
      
      // 获取身高体重的中间值
      const height = (heightOption.value[0] + heightOption.value[1]) / 2;
      const weight = (weightOption.value[0] + weightOption.value[1]) / 2;
      
      // 计算BMI
      const bmi = weight / ((height/100) * (height/100));
      
      // 计算得分
      let score = 80; // 基础分
      
      // 身高得分（占50%）
      if (height >= 160 && height <= 170) {
        score += 10; // 理想身高
      } else if (height > 170) {
        score += 5; // 偏高
      } else if (height >= 155 && height < 160) {
        score += 5; // 偏低
      }
      
      // BMI得分（占50%）
      if (bmi >= 18.5 && bmi <= 23) {
        score += 10; // 理想BMI
      } else if ((bmi > 23 && bmi <= 25) || (bmi >= 17.5 && bmi < 18.5)) {
        score += 5; // 可接受范围
      }
      
      // 保存答案
      const answer = {
        step: this.currentStep,
        dimension: this.currentQuestion.dimension,
        subdimension: this.currentQuestion.subdimension,
        weight: this.currentQuestion.weight,
        value: score,
        heightValue: height,
        weightValue: weight,
        bmi: bmi
      };
      
      this.answers[this.currentStep - 1] = answer;
    },
    
    validateNumberInput() {
      if (!this.currentQuestion || this.currentQuestion.type !== 'number') {
        return true;
      }
      
      const value = parseFloat(this.selectedOption);
      if (isNaN(value)) {
        uni.showToast({
          title: '请输入有效数字',
          icon: 'none'
        });
        return false;
      }
      
      const { min, max } = this.currentQuestion.validation;
      if (value < min || value > max) {
        uni.showToast({
          title: `请输入${min}到${max}之间的数值`,
          icon: 'none'
        });
        return false;
      }
      
      // Save answer for number type
      const answer = {
        step: this.currentStep,
        dimension: this.currentQuestion.dimension,
        subdimension: this.currentQuestion.subdimension,
        weight: this.currentQuestion.weight,
        value: this.calculatePhysicalScore(value)
      };
      this.answers[this.currentStep - 1] = answer;
      
      return true;
    },
    
    calculatePhysicalScore(value) {
      const question = this.currentQuestion;
      if (question.subdimension === 'height') {
        // 身高评分规则（女性）
        if (value >= 160 && value <= 170) return 100; // 理想身高
        if (value > 170) return 90; // 偏高
        if (value >= 155 && value < 160) return 80; // 偏低
        return 70; // 其他
      } else if (question.subdimension === 'weight') {
        // 体重评分规则（需要结合身高计算BMI）
        const height = parseFloat(this.answers[0]?.value) || 160;
        const bmi = value / ((height/100) * (height/100));
        if (bmi >= 18.5 && bmi <= 23) return 100; // 理想BMI
        if (bmi > 23 && bmi <= 25) return 90; // 轻微超重
        if (bmi > 25 || bmi < 18.5) return 80; // 需要调整
        return 70;
      }
      return 80; // 默认分数
    },
    
    calculateScores() {
      // 按维度分组计算得分
      const dimensions = {
        appearance: { total: 35, score: 0 }, // 外在条件
        development: { total: 30, score: 0 }, // 个人发展
        quality: { total: 20, score: 0 }, // 内在素质
        family: { total: 15, score: 0 }, // 家庭背景
        physical: { total: 10, score: 0 } // 身体素质
      }
      
      // 计算每个维度的得分
      this.answers.forEach(answer => {
        const weightedScore = (answer.value * answer.weight) / 100
        dimensions[answer.dimension].score += weightedScore
      })
      
      // 计算每个维度的百分比得分
      Object.keys(dimensions).forEach(key => {
        const dim = dimensions[key]
        dim.score = (dim.score / dim.total) * 100
      })
      
      // 计算总分（基于各维度权重）
      const totalScore = Object.entries(dimensions).reduce((sum, [key, dim]) => {
        return sum + (dim.score * dim.total / 100)
      }, 0)
      
      return {
        total: totalScore,
        dimensions: dimensions
      }
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
      if (this.currentQuestion.type === 'number' && !this.validateNumberInput()) {
        return;
      }
      if (this.currentQuestion.type === 'physical' && (!this.selectedHeight || !this.selectedWeight)) {
        uni.showToast({
          title: '请选择身高和体重',
          icon: 'none'
        })
        return
      }
      if (!this.selectedOption && this.currentQuestion.type !== 'physical') {
        uni.showToast({
          title: '请选择一个选项',
          icon: 'none'
        })
        return
      }

      if (this.currentStep < this.totalSteps) {
        this.currentStep++
        this.selectedOption = ''
        this.selectedHeight = ''
        this.selectedWeight = ''
      } else {
        this.submitAssessment()
      }
    },
    submitAssessment() {
      const scores = this.calculateScores()
      
      // 根据城市等级调整分数
      let cityAdjustment = 0
      switch (this.city) {
        case '一线城市':
          cityAdjustment = -10
          break
        case '新一线城市':
          cityAdjustment = -5
          break
        case '二线城市':
          cityAdjustment = 0
          break
        case '三线城市':
          cityAdjustment = 5
          break
      }
      
      const finalScore = Math.min(100, Math.max(0, scores.total + cityAdjustment))
      
      // 跳转到结果页面，传递所有分数
      uni.navigateTo({
        url: `../result/result?score=${finalScore}&city=${encodeURIComponent(this.city)}&dimensionScores=${encodeURIComponent(JSON.stringify(scores.dimensions))}`
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: #ffffff;
  
  .progress-bar {
    margin-bottom: 60rpx;
    
    progress {
      width: 100%;
      border-radius: 8rpx;
    }
    
    .progress-text {
      font-size: 24rpx;
      color: #999;
      margin-top: 10rpx;
      display: block;
      text-align: center;
    }
  }
  
  .question-container {
    margin-bottom: 60rpx;
    
    .question-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .question-subtitle {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 40rpx;
      display: block;
    }
    
    .options {
      .option-item {
        display: flex;
        align-items: flex-start;
        padding: 30rpx;
        background: #f8f8f8;
        border-radius: 16rpx;
        margin-bottom: 20rpx;
        transition: all 0.3s ease;
        
        &.option-selected {
          background: rgba(255, 107, 129, 0.1);
          border: 2rpx solid #ff6b81;
        }
        
        radio {
          margin-top: 6rpx;
          transform: scale(0.8);
        }
        
        .option-content {
          flex: 1;
          margin-left: 20rpx;
          
          .option-text {
            font-size: 30rpx;
            color: #333;
            margin-bottom: 8rpx;
            display: block;
          }
          
          .option-desc {
            font-size: 24rpx;
            color: #666;
            display: block;
          }
        }
      }
      
      .number-input {
        display: flex;
        align-items: center;
        margin: 20rpx 0;
        
        .input-field {
          flex: 1;
          height: 80rpx;
          padding: 0 20rpx;
          border: 2rpx solid #ddd;
          border-radius: 8rpx;
          font-size: 32rpx;
        }
        
        .input-unit {
          margin-left: 20rpx;
          font-size: 28rpx;
          color: #666;
        }
      }
      
      .physical-inputs {
        padding: 20rpx;
        
        .physical-group {
          margin-bottom: 30rpx;
          
          .group-label {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 20rpx;
            display: block;
          }
          
          .physical-options {
            display: flex;
            flex-wrap: wrap;
            gap: 20rpx;
            
            .option-item {
              width: calc(50% - 10rpx);
              margin: 0;
            }
          }
        }
      }
    }
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    padding: 40rpx 0;
    
    .prev-btn {
      width: 200rpx;
      height: 88rpx;
      line-height: 88rpx;
      background: #f8f8f8;
      color: #666;
      font-size: 32rpx;
      border-radius: 44rpx;
      
      &:active {
        opacity: 0.8;
      }
    }
    
    .next-btn {
      flex: 1;
      margin-left: 40rpx;
      height: 88rpx;
      line-height: 88rpx;
      background: #ff6b81;
      color: #ffffff;
      font-size: 32rpx;
      border-radius: 44rpx;
      
      &:active {
        opacity: 0.9;
      }
      
      &[disabled] {
        background: #cccccc;
        opacity: 0.6;
      }
    }
  }
}
</style>
