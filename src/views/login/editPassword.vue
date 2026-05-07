<template>
  <div class="app-container">
    <h1>修改管理员密码</h1>
    <el-form ref="form" label-position="top" label-width="80px" :model="form" :rules="formRules">
      <el-form-item label="请输入新密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
    </el-form>
    <router-link to="/dashboard">
      <el-button>返回首页</el-button>
    </router-link>
    <el-button type="primary" style="margin-left: 20px;" @click="submitForm">确定修改</el-button>
  </div>
</template>

<script>
import { editPwd } from '@/api/user'

export default {
  data() {
    return {
      form: {
        password: ''
      },
      formRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交密码修改，成功后自动退出登录
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          editPwd({
            password: this.form.password
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '密码修改成功'
              })
              this.$store.dispatch('user/logout')
              this.$router.push(`/login`)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 200px;
}
</style>
