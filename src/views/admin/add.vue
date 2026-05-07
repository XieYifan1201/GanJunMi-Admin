<template>
  <div class="app-container">
    <!-- 新增管理员表单 -->
    <el-form ref="form" :model="form" class="form" :rules="formRules">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="账号" prop="openid">
        <el-input v-model="form.openid" autocomplete="off" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" autocomplete="off" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="form.idCard" autocomplete="off" placeholder="请输入身份证号" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio v-model="form.sex" label="男">男</el-radio>
        <el-radio v-model="form.sex" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="类型" prop="roleId">
        <el-radio v-model="form.roleId" label="1">系统管理员</el-radio>
        <el-radio v-model="form.roleId" label="2">普通管理员</el-radio>
      </el-form-item>
      <p>系统管理员：可以增加删除系统管理员和普通管理员账号，也可以操作培训管理等操作</p>
      <p>普通管理员：只可以操作培训管理等操作</p>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { addAdmin } from '@/api/admin'

export default {
  data() {
    return {
      // 表单数据
      form: {
        sex: '男',
        roleId: '2'
      },
      // 表单验证规则
      formRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        openid: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, message: '长度不能小于5位', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: '^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$', message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$', message: '请输入正确的身份证号', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择权限', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交新增管理员表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addAdmin(this.form).then(res => {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.form = {}
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
.form {
  margin: 50px auto 0;
  width: 60%;
}

.dialog-footer {
  text-align: right;
}
</style>
