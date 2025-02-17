<template>
  <div class="app-container">
    <div class="btn">
      <p>培训名称：</p>
      <el-select v-model="value" placeholder="请选择培训" @change="selectChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div class="btn" style="margin-top: 20px;">
      <el-button type="primary" :disabled="!value" @click="openDialog('dialog1')">新增班次</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      class="table"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :cell-style="{'text-align':'center'}"
      :header-cell-style="{'text-align':'center'}"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column label="培训期数">
        <template v-slot="scope">
          <span>{{ scope.row.trainsClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开班日期">
        <template v-slot="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结班日期">
        <template v-slot="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训人数">
        <template v-slot="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名人数">
        <template v-slot="scope">
          <span>{{ scope.row.count }}</span>
          <el-button type="primary" style="margin-left: 10px;" plain @click="openDialog('dialog3', scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <div class="btn">
            <el-button type="primary" icon="el-icon-edit" circle @click="openDialog('dialog2', scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.row.trainsClassId, scope.row.trainsClassName)" />
            <el-button type="primary" @click="exportExcel(scope.row.trainsClassId, scope.row.trainsClassName)">导出Excel</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增 -->
    <el-dialog title="新增培训期数" :visible.sync="dialogVisible1" width="50%" @close="resetForm('form1')">
      <el-form ref="form1" :model="form1" :rules="formRules">
        <el-form-item label="培训名称" :label-width="labelWidth">
          <el-select v-model="value" placeholder="请选择培训" style="margin-right: 20px;" @change="selectChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="培训期数" :label-width="labelWidth" prop="trainsClassName">
          <el-input v-model="form1.trainsClassName" autocomplete="off" placeholder="例：第1期" />
        </el-form-item>
        <el-form-item label="培训人数" :label-width="labelWidth" prop="amount">
          <el-input v-model="form1.amount" type="number" autocomplete="off" placeholder="请输入数字（人数）" />
        </el-form-item>
        <el-form-item label="培训日期" :label-width="labelWidth" prop="date">
          <el-date-picker v-model="form1.date" type="daterange" range-separator="至" start-placeholder="开班日期" end-placeholder="结班日期" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="submitForm('form1')">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑班次" :visible.sync="dialogVisible2" width="50%" @close="resetForm('form2')">
      <el-form ref="form2" :model="form2" :rules="formRules">
        <el-form-item label="培训期数" :label-width="labelWidth" prop="trainsClassName">
          <el-input v-model="form2.trainsClassName" autocomplete="off" placeholder="例：第1期" />
        </el-form-item>
        <el-form-item label="培训人数" :label-width="labelWidth" prop="amount">
          <el-input v-model="form2.amount" type="number" autocomplete="off" placeholder="请输入数字（人数）" />
        </el-form-item>
        <el-form-item label="培训日期" :label-width="labelWidth" prop="date">
          <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开班日期" end-placeholder="结班日期" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogVisible2 = false">关闭</el-button>
          <el-button type="primary" @click="submitForm('form2')">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog title="报名人员" :visible.sync="dialogVisible3" width="75%">
      <el-table
        class="table"
        :data="stuList"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="姓名">
          <template v-slot="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号">
          <template v-slot="scope">
            <span>{{ scope.row.idCard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template v-slot="scope">
            <span>{{ scope.row.sex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话号码">
          <template v-slot="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位">
          <template v-slot="scope">
            <span>{{ scope.row.workUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template v-slot="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="证书">
          <template v-slot="scope">
            <el-tag v-if="scope.row.certificate" type="success">已获得</el-tag>
            <el-tag v-else type="danger">未获得</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-footer">
        <el-button style="margin-top: 20px;" @click="dialogVisible3 = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { addTrains, removeTrains, editTrains, getTrains, getPhaseList, getStudents } from '@/api/trains'
import cloneDeep from 'lodash/cloneDeep'
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      list: [],
      listLoading: false,
      // 输入框宽度
      labelWidth: '120px',
      // 弹出框状态
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      date: '',
      // 文本框内容
      form1: {
        trainsClassName: '',
        startDate: '',
        endDate: '',
        amount: '',
        date: ''
      },
      form2: {},
      // 表单验证
      formRules: {
        trainsTitle: [
          { required: true, message: '请选择培训名称', trigger: 'blur' }
        ],
        trainsClassName: [
          { required: true, message: '请输入培训期数', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入培训人数', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请输入培训日期', trigger: 'blur' }
        ]
      },
      // 多选框
      options: [],
      value: '',
      // 学员列表
      stuList: []
    }
  },
  created() {
    this.getPhase()
  },
  methods: {
    // 获取所有期次
    getPhase() {
      this.options = []
      getPhaseList({
        'page': 1,
        'pageSize': 999999,
        'state': 1
      }).then(res => {
        res.data.records.map(item => {
          this.options.push({
            value: item.trainsId,
            label: item.trainsTitle
          })
        })
        this.value = res.data.records[0].trainsId
        this.selectChange()
      })
    },
    // 期数选择框
    selectChange() {
      this.getData(this.value)
    },
    // 查询
    getData(id) {
      this.listLoading = true
      getTrains({
        'id': id
      }).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    // 重置弹窗表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 开启弹窗
    openDialog(dialog, trains) {
      if (dialog === 'dialog1') {
        this.dialogVisible1 = true
      } else if (dialog === 'dialog2') {
        this.form2 = cloneDeep(trains)
        this.form2.date = true
        this.date = [new Date(this.form2.startDate + 'T00:00:00+08:00'), new Date(this.form2.endDate + 'T00:00:00+08:00')]
        this.dialogVisible2 = true
      } else if (dialog === 'dialog3') {
        this.getStu(trains.trainsClassId)
        this.dialogVisible3 = true
      }
    },
    // 获取学员列表
    getStu(id) {
      getStudents({
        'page': 1,
        'pageSize': 9999999,
        'trainsClassId': id,
        'unitReverse': true
      }).then(res => {
        this.stuList = res.data.records
      })
    },
    // 导出excel
    exportExcel(id, name) {
      getStudents({
        'page': 1,
        'pageSize': 9999999,
        'trainsClassId': id,
        'unitReverse': true,
        'areaReverse': true
      }).then(res => {
        const data = res.data.records
        const newData = data.map(({ studentCertificateId, studentId, duties, image, special_content, date, pay, certificate, ...rest }) => rest)
        const worksheet = XLSX.utils.json_to_sheet(newData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
        XLSX.writeFile(workbook, `${name}学员信息.xlsx`)
      })
    },
    // 确认按钮
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = this[formName]
          if (formName === 'form1') {
            formData.startDate = new Date(new Date(formData.date[0]).getTime() + 8 * 3600 * 1000).toISOString().split('T')[0]
            formData.endDate = new Date(new Date(formData.date[1]).getTime() + 8 * 3600 * 1000).toISOString().split('T')[0]
            formData.trainsInfoId = this.value
            addTrains(formData).then(res => {
              this.dialogVisible1 = false
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.resetForm(formName)
              this.selectChange()
            })
          }
          if (formName === 'form2') {
            this.form2.startDate = new Date(new Date(this.date[0]).getTime() + 8 * 3600 * 1000).toISOString().split('T')[0]
            this.form2.endDate = new Date(new Date(this.date[1]).getTime() + 8 * 3600 * 1000).toISOString().split('T')[0]
            editTrains(this.form2).then(res => {
              this.dialogVisible2 = false
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.resetForm(formName)
              this.selectChange()
            })
          }
        } else {
          return false
        }
      })
    },
    // 删除
    del(id, name) {
      this.$confirm(`此操作将永久删除${name}, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeTrains({
          trainsClassId: id
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.selectChange()
        })
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
</style>
