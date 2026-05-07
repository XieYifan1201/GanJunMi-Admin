<template>
  <div class="app-container">
    <!-- 筛选条件 -->
    <div class="filter-bar">
      <el-select v-model="phaseId" placeholder="请选择期数" @change="onPhaseChange">
        <el-option
          v-for="item in phaseOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="classId" placeholder="请选择班次" style="margin-left: 20px;" @change="fetchData()">
        <el-option
          v-for="item in classOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="filterType" placeholder="请选择分类" style="margin-left: 20px;" @change="fetchData()">
        <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <!-- 未获证书时显示颁发按钮和提示 -->
    <div v-if="filterType === 1">
      <el-button type="primary" style="margin-top: 20px;" @click="issueCertificate()">颁发证书</el-button>
      <p>温馨提示：颁布证书前请在培训证书管理，设置这期证书信息！</p>
    </div>

    <!-- 学员列表 -->
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
          <img :src="scope.row.image" alt="img" style="height: 80px;" @click="openPhotoDialog(scope.row.image)">
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
          <div class="action-btns">
            <el-button type="primary" icon="el-icon-edit" circle @click="openEditDialog(scope.row.studentCertificateId)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteStudent(scope.row.studentId, scope.row.name)" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 修改证书内容弹窗 -->
    <el-dialog title="修改证书内容" :visible.sync="editDialogVisible" width="50%">
      <el-form ref="editForm" :model="editForm">
        <el-form-item label="证书内容" :label-width="labelWidth">
          <el-input v-model="editForm.content" autocomplete="off" placeholder="请输入证书内容" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm()">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 证件照查看弹窗 -->
    <el-dialog title="证件照" :visible.sync="photoDialogVisible" width="20%">
      <img :src="currentPhoto" alt="img" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
import { getPhaseList, getStudents, getTrains, issueCertificate, setCerContent, getCertificate } from '@/api/trains'
import { delStuList } from '@/api/student'

export default {
  data() {
    return {
      // 当前选中的培训期数ID
      phaseId: '',
      // 当前选中的班次ID
      classId: '',
      // 学员列表数据
      list: [],
      // 列表加载状态
      listLoading: false,
      // 分页相关
      total: 0,
      pageSize: 10,
      // 表单标签宽度
      labelWidth: '120px',
      // 修改证书内容弹窗
      editDialogVisible: false,
      editForm: {
        id: '',
        content: ''
      },
      // 证件照查看弹窗
      photoDialogVisible: false,
      currentPhoto: '',
      // 培训期数下拉选项
      phaseOptions: [],
      // 班次下拉选项
      classOptions: [],
      // 已勾选的学员证书ID列表（用于批量颁发）
      selectedCerIds: [],
      // 学员分类筛选：0-全部，1-未获证书，2-已获证书
      filterType: 0,
      filterOptions: [
        { label: '所有学员', value: 0 },
        { label: '未获证书', value: 1 },
        { label: '已获证书', value: 2 }
      ]
    }
  },
  created() {
    this.fetchData()
    this.loadPhaseList()
  },
  methods: {
    // 加载培训期数列表
    loadPhaseList() {
      this.phaseOptions = []
      getPhaseList({
        'page': 1,
        'pageSize': 9999999,
        'state': 1
      }).then(res => {
        res.data.records.map(item => {
          this.phaseOptions.push({ value: item.trainsId, label: item.trainsTitle })
        })
        // 默认选中第一个期数，并加载其班次
        this.phaseId = res.data.records[0].trainsId
        this.loadClassList()
      })
    },

    // 根据期数ID加载班次列表
    loadClassList() {
      this.classOptions = []
      getTrains({
        id: this.phaseId
      }).then(res => {
        res.data.map(item => {
          this.classOptions.push({ value: item.trainsClassId, label: item.trainsClassName })
        })
        // 默认选中第一个班次，并刷新学员列表
        this.classId = res.data[0].trainsClassId
        this.fetchData()
      })
    },

    // 切换期数时重新加载班次
    onPhaseChange() {
      this.loadClassList()
    },

    // 分页查询学员列表
    fetchData(page = 1) {
      this.listLoading = true
      getStudents({
        'page': page,
        'pageSize': this.pageSize,
        'trainsClassId': this.classId,
        'state': this.filterType,
        'unitReverse': true,
        'areaReverse': true
      }).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
      })
    },

    // 切换页码
    handlePageChange(page) {
      this.fetchData(page)
    },

    // 切换每页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },

    // 打开修改证书内容弹窗
    openEditDialog(certificateId) {
      getCertificate({
        'ids': [certificateId],
        'trainsClassId': this.phaseId,
        'trainsId': this.classId
      }).then(res => {
        this.editForm = {
          id: certificateId,
          content: res.data[0].special_content
        }
        this.editDialogVisible = true
      })
    },

    // 打开证件照查看弹窗
    openPhotoDialog(imageUrl) {
      this.currentPhoto = imageUrl
      this.photoDialogVisible = true
    },

    // 删除学员（取消报名）
    deleteStudent(id, name) {
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

    // 表格多选变化，收集选中的学员证书ID
    handleSelectionChange(selection) {
      this.selectedCerIds = []
      selection.map(item => {
        this.selectedCerIds.push(item.studentCertificateId)
      })
    },

    // 提交证书内容修改
    submitEditForm() {
      setCerContent(this.editForm).then(res => {
        this.editDialogVisible = false
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      })
    },

    // 批量颁发证书
    issueCertificate() {
      issueCertificate({
        'ids': this.selectedCerIds,
        'trainsClassId': this.classId,
        'trainsId': this.phaseId
      }).then(res => {
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

.filter-bar {
  display: flex;
}

.action-btns {
  display: flex;
}

.dialog-footer {
  text-align: right;
}
</style>
