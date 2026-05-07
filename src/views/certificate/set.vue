<template>
  <div class="app-container">
    <!-- 证书模板设置表单 -->
    <el-form ref="form" :model="form" class="form" :rules="formRules">
      <el-form-item label="培训名称">
        <el-select v-model="id" style="display: block;" placeholder="请选择培训" @change="onPhaseChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="证书标题" prop="title">
        <el-input v-model="form.title" autocomplete="off" placeholder="请输入证书标题" />
      </el-form-item>
      <el-form-item label="颁证单位" prop="trainUnit">
        <el-input v-model="form.trainUnit" autocomplete="off" placeholder="请输入颁证单位" />
      </el-form-item>
      <el-form-item label="有效期" prop="deadline">
        <el-input v-model="form.deadline" autocomplete="off" placeholder="例：三年" />
      </el-form-item>
      <el-form-item label="发证日期" prop="date">
        <el-date-picker v-model="date" type="date" placeholder="选择日期" />
      </el-form-item>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getPhaseList, setCer, getCer } from '@/api/trains'

export default {
  data() {
    return {
      // 当前选中的培训期数ID
      id: '',
      // 证书模板表单数据
      form: {},
      // 发证日期（单独管理，因为日期选择器返回的是Date对象）
      date: '',
      // 培训期数下拉选项
      options: [],
      // 表单验证规则
      formRules: {
        title: [
          { required: true, message: '请输入证书标题', trigger: 'blur' }
        ],
        trainUnit: [
          { required: true, message: '请输入颁证单位', trigger: 'blur' }
        ],
        deadline: [
          { required: true, message: '请输入有效期', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadPhaseList()
  },
  methods: {
    // 加载培训期数列表，填充下拉选项
    loadPhaseList() {
      this.options = []
      getPhaseList({
        'page': 1,
        'pageSize': 9999999,
        'state': 1
      }).then(res => {
        res.data.records.map(item => {
          this.options.push({ value: item.trainsId, label: item.trainsTitle })
        })
      })
    },

    // 切换培训期数时，加载对应的证书模板信息
    onPhaseChange() {
      getCer({
        'trainsInfoId': this.id
      }).then(res => {
        this.form = res.data
        if (res.data.startDate) {
          this.date = new Date(res.data.startDate)
        }
      })
    },

    // 提交证书模板设置
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 日期转换为ISO格式字符串，取日期部分（加8小时修正时区偏移）
          this.form.startDate = new Date(new Date(this.date).getTime() + 8 * 3600 * 1000).toISOString().split('T')[0]
          setCer(this.form).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
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
