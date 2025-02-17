<template>
  <div class="app-container">
    <!-- 设置证书信息 -->
    <el-form ref="form" :model="form" class="form" :rules="formRules">
      <el-form-item label="培训名称">
        <el-select v-model="id" style="display: block;" placeholder="请选择培训" @change="change">
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
      // 期数id
      id: '',
      // 班次id
      trainsId: '',
      img: '',
      // 期数证书信息
      form: {},
      date: '',
      // 期数查询选择
      options: [],
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
    this.getPhase()
  },
  methods: {
    // 查询期次
    getPhase() {
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
    change() {
      getCer({
        'trainsInfoId': this.id
      }).then(res => {
        this.form = res.data
        if (res.data.startDate) {
          this.date = new Date(res.data.startDate)
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'form') {
            this.form.startDate = new Date(new Date(this.date).getTime() + 8 * 3600 * 1000).toISOString().split('T')[0]
            setCer(this.form).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
.table {
  margin-top: 20px;
}

.btn {
  display: flex;
}

.dialog-footer {
  text-align: right;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 250px;
  line-height: 250px;
  text-align: center;
}
.avatar {
  width: 180px;
  height: 250px;
  display: block;
}
.form {
  margin: 50px auto 0;
  width: 60%;
}
</style>
