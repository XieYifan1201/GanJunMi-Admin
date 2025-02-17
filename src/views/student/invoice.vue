<template>
  <div class="app-container">
    <div class="btn">
      <el-input v-model="name" placeholder="请输入姓名" style="width: 150px;" />
      <el-select v-model="trainsId" style="margin-left: 20px;" placeholder="请选择培训" @change="getTrain()">
        <el-option
          v-for="item in trainsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="trainsId2" style="margin-left: 20px;" placeholder="请选择期数">
        <el-option
          v-for="item in trainsOptions2"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="invoice" placeholder="请选择发票状态" style="margin-left: 20px;">
        <el-option
          v-for="item in invoiceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="pay" placeholder="请选择缴费状态" style="margin-left: 20px;">
        <el-option
          v-for="item in payOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" style="margin-left: 20px;" @click="search(page)">查询</el-button>
    </div>
    <div class="btn" style="margin-top: 20px;">
      <el-button type="primary" :disabled="selectList.length <= 0" @click="openDialog('dialog2')">设置缴费状态</el-button>
      <el-button type="primary" :disabled="selectList.length <= 0 || selectList.length > 1" @click="openDialog('dialog1')">设置开票信息</el-button>
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
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column label="姓名" width="100">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="60">
        <template v-slot="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="200">
        <template v-slot="scope">
          <span>{{ scope.row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="150">
        <template v-slot="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作单位">
        <template v-slot="scope">
          <span>{{ scope.row.workUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缴费状态" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.pay" type="success">已缴费</el-tag>
          <el-tag v-else type="danger">未缴费</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发票类型(鼠标悬浮查看)" width="200">
        <template v-slot="scope">
          <span v-if="scope.row.invoiceId === 0">无</span>
          <div v-else>
            <el-popover v-if="scope.row.special" effect="light" placement="left" trigger="hover">
              <h3>增值税专用发票</h3>
              <p>抬头：{{ scope.row.invoiceHead }}</p>
              <p>税号：{{ scope.row.invoiceNo }}</p>
              <p>开户银行名：{{ scope.row.bankName }}</p>
              <p>银行账号：{{ scope.row.bangNo }}</p>
              <p>公司地址：{{ scope.row.unitAddress }}</p>
              <p>公司电话：{{ scope.row.unitPhone }}</p>
              <span slot="reference">增值税专用发票</span>
            </el-popover>
            <el-popover v-else effect="light" placement="left" trigger="hover">
              <h3>普通发票</h3>
              <p>抬头：{{ scope.row.invoiceHead }}</p>
              <p>税号：{{ scope.row.invoiceNo }}</p>
              <span slot="reference">普通发票</span>
            </el-popover>
          </div>
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
    <!-- 发票 -->
    <el-dialog title="发票" :visible.sync="dialogVisible1" width="50%">
      <el-form v-if="special === '1'" ref="form" :model="form" :rules="formRules2">
        <el-form-item label="发票类型">
          <el-radio v-model="special" label="1">增值税专用发票</el-radio>
          <el-radio v-model="special" label="2">普通发票</el-radio>
        </el-form-item>
        <el-form-item label="抬头" :label-width="labelWidth" prop="invoiceHead">
          <el-input v-model="form.invoiceHead" autocomplete="off" placeholder="请输入抬头" />
        </el-form-item>
        <el-form-item label="税号" :label-width="labelWidth" prop="invoiceNo">
          <el-input v-model="form.invoiceNo" autocomplete="off" placeholder="请输入税号" />
        </el-form-item>
        <el-form-item label="银行开户名" :label-width="labelWidth" prop="bankName">
          <el-input v-model="form.bankName" autocomplete="off" placeholder="请输入银行开户名" />
        </el-form-item>
        <el-form-item label="银行账号" :label-width="labelWidth" prop="bangNo">
          <el-input v-model="form.bangNo" autocomplete="off" placeholder="请输入银行账号" />
        </el-form-item>
        <el-form-item label="公司地址" :label-width="labelWidth" prop="unitAddress">
          <el-input v-model="form.unitAddress" autocomplete="off" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="公司电话" :label-width="labelWidth" prop="unitPhone">
          <el-input v-model="form.unitPhone" autocomplete="off" placeholder="请输入公司电话" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
        </div>
      </el-form>
      <el-form v-else ref="form" :model="form" :rules="formRules">
        <el-form-item label="发票类型">
          <el-radio v-model="special" label="1">增值税专用发票</el-radio>
          <el-radio v-model="special" label="2">普通发票</el-radio>
        </el-form-item>
        <el-form-item label="抬头" :label-width="labelWidth" prop="invoiceHead">
          <el-input v-model="form.invoiceHead" autocomplete="off" placeholder="请输入抬头" />
        </el-form-item>
        <el-form-item label="税号" :label-width="labelWidth" prop="invoiceNo">
          <el-input v-model="form.invoiceNo" autocomplete="off" placeholder="请输入税号" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 缴费状态 -->
    <el-dialog title="发票" :visible.sync="dialogVisible2" width="50%">
      <el-form ref="form2" :model="form2">
        <el-form-item label="学员" :label-width="labelWidth">
          {{ nameList }}
        </el-form-item>
        <el-form-item label="缴费" :label-width="labelWidth">
          <el-switch v-model="form2.payState" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="submitForm('form2')">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getStuList2, editInvoice, setPay } from '@/api/student'
import { getPhaseList, getTrains } from '@/api/trains'
import cloneDeep from 'lodash/cloneDeep'

export default {
  data() {
    return {
      // 学员列表
      list: [],
      // 加载
      listLoading: false,
      // 分页器
      total: 0,
      page: 1,
      pageSize: 10,
      // 输入框宽度
      labelWidth: '120px',
      // 弹出框状态
      dialogVisible1: false,
      dialogVisible2: false,
      // 发票
      form: {
        special: true
      },
      special: '1',
      // 表单验证
      formRules: {
        invoiceHead: [
          { required: true, message: '请输入抬头', trigger: 'blur' }
        ],
        invoiceNo: [
          { required: true, message: '请输入税号', trigger: 'blur' }
        ]
      },
      formRules2: {
        invoiceHead: [
          { required: true, message: '请输入抬头', trigger: 'blur' }
        ],
        invoiceNo: [
          { required: true, message: '请输入税号', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '请输入税号', trigger: 'blur' }
        ],
        bangNo: [
          { required: true, message: '请输入银行账号', trigger: 'blur' }
        ],
        unitAddress: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
        unitPhone: [
          { required: true, message: '请输入公司电话', trigger: 'blur' }
        ]
      },
      // 用户列表
      selectList: [],
      // 期数查询选择
      trainsOptions: [],
      trainsOptions2: [{ value: '', label: '所有期数' }],
      invoiceOptions: [{ value: '0', label: '所有开票信息' }, { value: '1', label: '有开票信息' }, { value: '2', label: '无开票信息' }],
      payOptions: [{ value: '0', label: '所有缴费状态' }, { value: '1', label: '已缴费' }, { value: '2', label: '未缴费' }],
      invoice: '0',
      pay: '0',
      // 查询内容
      name: '',
      trainsId: '',
      trainsId2: '',
      // 设置缴费状态
      form2: {
        payState: false
      },
      idList: [],
      nameList: ''
    }
  },
  created() {
    this.fetchData()
    this.getPhase()
  },
  methods: {
    // 查询期次
    getPhase() {
      this.trainsOptions = []
      getPhaseList({
        'page': 1,
        'pageSize': 9999999,
        'state': 1
      }).then(res => {
        res.data.records.map(item => {
          this.trainsOptions.push({ value: item.trainsId, label: item.trainsTitle })
        })
        this.trainsId = this.trainsOptions[this.trainsOptions.length - 1].value
      })
    },
    // 分页查询
    fetchData(page = 1) {
      this.listLoading = true
      getStuList2({
        'page': page,
        'pageSize': this.pageSize
      }).then(response => {
        this.total = response.data.total
        this.list = response.data.records
        this.listLoading = false
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
    // 切换页
    handlePageChange(page) {
      this.page = page
      if (this.pay === '0') {
        this.fetchData(page)
      } else {
        this.search(page)
      }
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
    openDialog(dialog) {
      if (dialog === 'dialog1') {
        this.form = cloneDeep(this.selectList[0])
        this.dialogVisible1 = true
      }
      if (dialog === 'dialog2') {
        this.nameList = ''
        this.idList = []
        this.selectList.map(item => {
          this.idList.push(item.studentCertificateId)
          this.nameList += item.name + ', '
        })
        this.dialogVisible2 = true
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = this[formName]
          if (formName === 'form') {
            if (this.special === '1') formData.special = true
            if (this.special === '2') formData.special = false
            editInvoice(formData).then(res => {
              this.dialogVisible1 = false
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.resetForm(formName)
              this.fetchData(this.page)
            })
          }
          if (formName === 'form2') {
            setPay({
              'ids': this.idList,
              'payStatue': this.form2.payState
            }).then(res => {
              this.dialogVisible2 = false
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
              this.resetForm(formName)
              this.fetchData(this.page)
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
    // 搜索
    search(page = 1) {
      this.listLoading = true
      getStuList2({
        'page': page,
        'pageSize': this.pageSize,
        'name': this.name,
        'trainsId': this.trainsId,
        'trainsClassId': this.trainsId2,
        'state': this.invoice,
        'payState': this.pay
      }).then(response => {
        this.total = response.data.total
        this.list = response.data.records
        this.listLoading = false
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
</style>
