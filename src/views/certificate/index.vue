<template>
  <div class="app-container">
    <div class="btn">
      <el-select v-model="id" placeholder="请选择期数" @change="change">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="trainsId" placeholder="请选择班次" style="margin-left: 20px;" @change="fetchData()">
        <el-option
          v-for="item in trainsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="stuValue" placeholder="请选择分类" style="margin-left: 20px;" @change="fetchData()">
        <el-option v-for="item in stuOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <!-- 未获得证书 -->
    <div v-if="stuValue === 1">
      <el-button type="primary" style="margin-top: 20px;" @click="cer()">颁发证书</el-button>
      <p>温馨提示：颁布证书前请在培训证书管理，设置这期证书信息！</p>
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
      <el-table-column type="selection" width="55" />
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
      <el-table-column label="证件照" width="100">
        <template v-slot="scope">
          <img :src="scope.row.image" alt="img" style="height: 80px;" @click="openDialog('dialog2', scope.row.image)">
        </template>
      </el-table-column>
      <el-table-column label="证书" width="90">
        <template v-slot="scope">
          <el-tag v-if="scope.row.certificate" type="success">已获得</el-tag>
          <el-tag v-else type="danger">未获得</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110">
        <template v-slot="scope">
          <div class="btn">
            <el-button type="primary" icon="el-icon-edit" circle @click="openDialog('dialog1', scope.row.studentCertificateId)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.row.studentId, scope.row.name)" />
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
    <el-dialog title="修改证书内容" :visible.sync="dialogVisible1" width="50%">
      <el-form ref="form" :model="form">
        <el-form-item label="证书内容" :label-width="labelWidth">
          <el-input v-model="form.content" autocomplete="off" placeholder="请输入证书内容" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 证件照 -->
    <el-dialog title="证件照" :visible.sync="dialogVisible2" width="20%">
      <img :src="img" alt="img" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
import { getPhaseList, getStudents, getTrains, issueCertificate, setCerContent, getCertificate } from '@/api/trains'
import { delStuList } from '@/api/student'

export default {
  data() {
    return {
      // 期数id
      id: '',
      // 班次id
      trainsId: '',
      // 报名学员列表
      list: [],
      // 加载
      listLoading: false,
      // 分页器
      total: 0,
      pageSize: 10,
      // 输入框宽度
      labelWidth: '120px',
      // 弹出框状态
      dialogVisible1: false,
      dialogVisible2: false,
      img: '',
      // 期数查询选择
      options: [],
      // 班次选择
      trainsOptions: [],
      // 选中的报名学员
      stuCerList: [],
      // 报名学员列表分类框
      stuValue: 0,
      stuOptions: [
        {
          label: '所有学员',
          value: 0
        },
        {
          label: '未获证书',
          value: 1
        },
        {
          label: '已获证书',
          value: 2
        }
      ],
      form: {
        content: ''
      }
    }
  },
  created() {
    this.fetchData()
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
        this.id = res.data.records[0].trainsId
        this.getTrainsList()
      })
    },
    // 查询班次
    getTrainsList() {
      this.trainsOptions = []
      getTrains({
        id: this.id
      }).then(res => {
        res.data.map(item => {
          this.trainsOptions.push({ value: item.trainsClassId, label: item.trainsClassName })
        })
        this.trainsId = res.data[0].trainsClassId
        this.fetchData()
      })
    },
    // 切换期数
    change() {
      this.getTrainsList()
    },
    // 分页查询
    fetchData(page = 1) {
      this.listLoading = true
      getStudents({
        'page': page,
        'pageSize': this.pageSize,
        'trainsClassId': this.trainsId,
        'state': this.stuValue,
        'unitReverse': true,
        'areaReverse': true
      }).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
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
    // 开启弹窗
    openDialog(dialog, data) {
      if (dialog === 'dialog1') {
        getCertificate({
          'ids': [data],
          'trainsClassId': this.id,
          'trainsId': this.trainsId
        }).then(res => {
          this.form = {
            id: data,
            content: res.data[0].special_content
          }
          this.dialogVisible1 = true
        })
      }
      if (dialog === 'dialog2') {
        this.img = data
        this.dialogVisible2 = true
      }
    },
    // 删除学员
    del(id, name) {
      this.$confirm(`此操作将取消${name}的报名, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delStuList({
          id: id
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      })
    },
    // 选择框
    handleSelectionChange(e) {
      this.stuCerList = []
      e.map(item => {
        this.stuCerList.push(item.studentCertificateId)
      })
    },
    // 修改证书内容
    submitForm(formName) {
      if (formName === 'form') {
        setCerContent(this.form).then(res => {
          this.dialogVisible1 = false
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
      }
    },
    cer() {
      issueCertificate({
        'ids': this.stuCerList,
        'trainsClassId': this.trainsId,
        'trainsId': this.id
      }).then(res => {
        // 颁发证书
        this.$message({
          type: 'success',
          message: '颁发成功!'
        })
        this.fetchData()
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
