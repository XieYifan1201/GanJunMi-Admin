<template>
  <div class="app-container">
    <h1>上传回执空表</h1>
    <el-upload
      action="http://shiptrains.jvtc.jx.cn:8103/api/uploadEmpty"
      :headers="header"
      :on-success="handleFileSuccess"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      // 上传请求头，携带token鉴权
      header: { 'token': getToken() }
    }
  },
  methods: {
    // 上传成功回调
    handleFileSuccess() {
      this.$message({
        type: 'success',
        message: '上传成功!'
      })
    }
  }
}
</script>
