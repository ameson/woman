<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    this.initBaiduAnalytics()
  },
  onShow: function() {
    console.log('App Show')
    this.initBaiduAnalytics()
  },
  onHide: function() {
    console.log('App Hide')
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
      }
    }
  }
}
</script>

<style>
  /*每个页面公共css */
</style>
