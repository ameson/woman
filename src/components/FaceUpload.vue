<template>
  <view class="face-upload">
    <view class="upload-header">
      <text class="privacy-note">隐私说明：您的照片仅用于打分，不会被保存</text>
    </view>
    
    <view class="upload-buttons">
      <button class="upload-btn" @click="chooseImage('album')">从相册选择</button>
      <button class="upload-btn" @click="chooseImage('camera')">拍照上传</button>
    </view>
    
    <view v-if="imageUrl" class="preview-area">
      <image :src="imageUrl" mode="aspectFit" class="preview-image"></image>
      <button class="submit-btn" @click="submitImage" :disabled="isSubmitting">
        {{ isSubmitting ? '评分中...' : '开始评分' }}
      </button>
    </view>
  </view>
</template>

<script>
import { uploadFaceImage } from '../api/face.js'

export default {
  name: 'FaceUpload',
  data() {
    return {
      imageUrl: '',
      isSubmitting: false
    }
  },
  methods: {
    chooseImage(sourceType) {
      uni.chooseImage({
        count: 1,
        sourceType: [sourceType],
        success: (res) => {
          this.imageUrl = res.tempFilePaths[0]
        },
        fail: (error) => {
          console.error('选择图片失败:', error)
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      })
    },
    async submitImage() {
      if (!this.imageUrl) {
        uni.showToast({
          title: '请先选择图片',
          icon: 'none'
        })
        return
      }

      this.isSubmitting = true
      try {
        const score = await uploadFaceImage(this.imageUrl)
        this.$emit('score-update', score)
        uni.showToast({
          title: '评分完成',
          icon: 'success'
        })
      } catch (error) {
        console.error('评分失败:', error)
        uni.showToast({
          title: error.message || '评分失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style lang="scss">
.face-upload {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  margin: 20rpx;

  .upload-header {
    text-align: center;
    margin-bottom: 30rpx;

    .privacy-note {
      font-size: 24rpx;
      color: #999;
      display: block;
    }
  }

  .upload-buttons {
    display: flex;
    justify-content: space-around;
    margin: 30rpx 0;

    .upload-btn {
      background-color: #ff8dd5;
      color: #fff;
      font-size: 28rpx;
      padding: 15rpx 40rpx;
      border-radius: 30rpx;
      border: none;
      width: 40%;
    }
  }

  .preview-area {
    text-align: center;

    .preview-image {
      width: 300rpx;
      height: 300rpx;
      margin: 20rpx auto;
      border-radius: 8rpx;
    }

    .submit-btn {
      background-color: #ff8dd5;
      color: #fff;
      font-size: 28rpx;
      padding: 15rpx 60rpx;
      border-radius: 30rpx;
      border: none;
      margin-top: 20rpx;

      &:disabled {
        background-color: #ccc;
      }
    }
  }
}
</style>
