<template>
  <div class="app-container">
    <div class="btn">
      <el-input v-model="name" placeholder="请输入姓名" style="width: 150px;" />
      <el-input v-model="idCard" placeholder="请输入身份证号" style="margin-left: 20px; width: 250px;" />
      <el-input v-model="workUnit" placeholder="请输入工作单位" style="margin-left: 20px; width: 250px;" />
      <el-select v-model="trainsId" style="margin-left: 20px;" placeholder="请选择培训" @change="getTrain()">
        <el-option
          v-for="item in trainsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="trainsId2" placeholder="请选择期数" style="margin-left: 20px;">
        <el-option
          v-for="item in trainsOptions2"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="city" style="margin-left: 20px;" placeholder="请选择地区">
        <el-option
          v-for="item in cityOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" style="margin-left: 20px;" @click="search()">查询</el-button>
    </div>
    <div class="btn" style="margin-top: 20px;">
      <el-button type="primary" :disabled="selectList.length <= 0" @click="exportExcel()">导出Excel</el-button>
      <el-button type="primary" :disabled="selectList.length <= 0 || selectList.length > 1" @click="openDialog('dialog3')">修改</el-button>
      <el-button type="danger" :disabled="selectList.length <= 0 || selectList.length > 1" @click="del()">删除</el-button>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="姓名" width="70">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="50">
        <template v-slot="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="170">
        <template v-slot="scope">
          <span>{{ scope.row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="110">
        <template v-slot="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地区" width="130">
        <template v-slot="scope">
          <span>{{ scope.row.city }}{{ scope.row.district }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址">
        <template v-slot="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作单位">
        <template v-slot="scope">
          <span>{{ scope.row.workUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名培训">
        <template v-slot="scope">
          <span>{{ scope.row.trainsTitle }} - {{ scope.row.trainsClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回执单" width="100">
        <template v-slot="scope">
          <span v-if="scope.row.receiptPath" style="color: #409EFF; cursor: pointer;" @click="download(scope.row.receiptPath)">下载</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="证件照" width="100">
        <template v-slot="scope">
          <el-button type="primary" plain @click="openDialog('dialog2', scope.row.image)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      style="margin-top: 20px;"
      layout="prev, pager, next, sizes, total"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 50, 100, 200]"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
    <!-- 证件照 -->
    <el-dialog title="证件照" :visible.sync="dialogVisible2" width="20%">
      <img :src="img" alt="img" style="width: 100%;">
    </el-dialog>
    <!-- 修改学员信息 -->
    <el-dialog title="修改学员信息" :visible.sync="dialogVisible3" width="50%" @close="resetForm('form3')">
      <el-form ref="form3" :model="form3" :rules="formRules2">
        <el-form-item label="姓名" :label-width="labelWidth" prop="name">
          <el-input v-model="form3.name" autocomplete="off" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="身份证号" :label-width="labelWidth" prop="idCard">
          <el-input v-model="form3.idCard" autocomplete="off" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="性别" :label-width="labelWidth">
          <el-radio v-model="form3.sex" label="男">男</el-radio>
          <el-radio v-model="form3.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="labelWidth" prop="phone">
          <el-input v-model="form3.phone" autocomplete="off" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="住址" :label-width="labelWidth" prop="address">
          <el-input v-model="form3.address" autocomplete="off" placeholder="请输入住址" />
        </el-form-item>
        <el-form-item label="工作单位" :label-width="labelWidth" prop="workUnit">
          <el-input v-model="form3.workUnit" autocomplete="off" placeholder="请输入工作单位" />
        </el-form-item>
        <el-form-item label="证件照" :label-width="labelWidth" prop="image">
          <el-upload
            class="avatar-uploader"
            :headers="header"
            action="http://shiptrains.jvtc.jx.cn:8103/api/upload"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form3.image" :src="form3.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取消</el-button>
          <el-button type="primary" @click="submitForm('form3')">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getStuList, delStuList, editStuList } from '@/api/student'
import { getPhaseList, getTrains } from '@/api/trains'
import { getToken } from '@/utils/auth'
import cloneDeep from 'lodash/cloneDeep'
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      // 上传图片token
      header: { 'token': getToken() },
      // 学员列表
      list: [],
      // 加载
      listLoading: false,
      // 分页器
      total: 0,
      pageSize: 10,
      // 输入框宽度
      labelWidth: '120px',
      // 弹出框状态
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible5: false,
      img: '',
      // 修改表单
      form3: {
        name: '',
        idCard: '',
        sex: '男',
        phone: '',
        address: '',
        workUnit: '',
        image: ''
      },
      // 表单验证
      formRules2: {
        trainsId: [
          { required: true, message: '请选择培训', trigger: 'blur' }
        ],
        trainClassId: [
          { required: true, message: '请选择期数', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$', message: '请输入正确的身份证号', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: '^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$', message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入住址', trigger: 'blur' }
        ],
        workUnit: [
          { required: true, message: '请输入工作单位', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请上传证件照', trigger: 'blur' }
        ]
      },
      // 报名列表
      selectList: [],
      // 期数查询选择
      trainsOptions: [{ value: '', label: '所有培训' }],
      trainsOptions2: [{ value: '', label: '所有期数' }],
      cityOptions: [
        { value: '', label: '所有地区' },
        { value: '南昌市', label: '南昌市' },
        { value: '九江市', label: '九江市' },
        { value: '上饶市', label: '上饶市' },
        { value: '抚州市', label: '抚州市' },
        { value: '宜春市', label: '宜春市' },
        { value: '吉安市', label: '吉安市' },
        { value: '赣州市', label: '赣州市' },
        { value: '景德镇市', label: '景德镇市' },
        { value: '萍乡市', label: '萍乡市' },
        { value: '新余市', label: '新余市' },
        { value: '鹰潭市', label: '鹰潭市' }
      ],
      // 查询内容
      name: '',
      trainsId: '',
      trainsId2: '',
      workUnit: '',
      idCard: '',
      city: ''
    }
  },
  created() {
    this.fetchData()
    this.getPhase()
  },
  methods: {
    // 查询期次
    getPhase() {
      this.trainsOptions = [{ value: '', label: '所有培训' }]
      getPhaseList({
        'page': 1,
        'pageSize': 9999999,
        'state': 1
      }).then(res => {
        res.data.records.map(item => {
          this.trainsOptions.push({ value: item.trainsId, label: item.trainsTitle })
        })
      })
    },
    getTrain() {
      this.trainsOptions2 = [{ value: '', label: '所有期数' }]
      getTrains({ id: this.trainsId }).then(res => {
        res.data.map(item => {
          this.trainsOptions2.push({ value: item.trainsClassId, label: item.trainsClassName })
        })
      })
    },
    // 分页查询
    fetchData(page = 1) {
      this.listLoading = true
      getStuList({
        'page': page,
        'pageSize': this.pageSize,
        'name': this.name,
        'trainsId': this.trainsId,
        'trainsClassId': this.trainsId2,
        'idCard': this.idCard,
        'workUnit': this.workUnit,
        'city': this.city,
        'unitReverse': true
      }).then(response => {
        this.total = response.data.total
        this.list = response.data.records
        this.listLoading = false
      })
    },
    // 切换页
    handlePageChange(page) {
      this.fetchData(page)
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 重置弹窗表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 开启弹窗
    openDialog(dialog, data) {
      if (dialog === 'dialog2') {
        this.img = data
        this.dialogVisible2 = true
      }
      if (dialog === 'dialog3') {
        this.dialogVisible3 = true
        this.form3 = cloneDeep(this.selectList[0])
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = this[formName]
          if (formName === 'form3') {
            editStuList(formData).then(res => {
              this.dialogVisible3 = false
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.resetForm(formName)
              this.fetchData()
            })
          }
        } else {
          return false
        }
      })
    },
    // 选择用户
    handleSelectionChange(e) {
      this.selectList = []
      e.map(item => {
        this.selectList.push(item)
      })
    },
    // 删除学员
    del() {
      this.$confirm(`此操作将永久删除${this.selectList[0].name}, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delStuList({
          id: this.selectList[0].id
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      })
    },
    // 头像上传成功
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.$message({
          'type': 'error',
          'message': res.msg
        })
      }
      this.form.image = res.data
      this.form3.image = res.data
    },
    // 搜索
    search() {
      this.page = 1
      getStuList({
        'page': this.page,
        'pageSize': this.pageSize,
        'name': this.name,
        'trainsId': this.trainsId,
        'trainsClassId': this.trainsId2,
        'idCard': this.idCard,
        'workUnit': this.workUnit,
        'city': this.city
      }).then(response => {
        this.total = response.data.total
        this.list = response.data.records
        this.listLoading = false
      })
    },
    // 导出excel
    exportExcel() {
      const data = this.selectList
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, '学员信息.xlsx')
    },
    // 下载回执单
    download(url) {
      window.open(url)
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
</style>
