<template>
  <div class="app-container">
    <div class="btn">
      <el-button type="primary" :disabled="selectList.length <= 0 || selectList.length > 1" @click="resAdminPwd()">重置密码</el-button>
      <el-button type="danger" style="margin-left: 20px;" :disabled="selectList.length <= 0 || selectList.length > 1" @click="del()">删除账号</el-button>
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
      <el-table-column label="姓名">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="100">
        <template v-slot="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template v-slot="scope">
          <span>{{ scope.row.openid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码">
        <template v-slot="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号">
        <template v-slot="scope">
          <span>{{ scope.row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template v-slot="scope">
          <span v-if="scope.row.roleId === 1">系统管理员</span>
          <span v-if="scope.row.roleId === 2">普通管理员</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="scope">
          <span>{{ scope.row.createTime }}</span>
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
  </div>
</template>

<script>
import { getAdminList, delAdmin, resPwd } from '@/api/admin'
export default {
  data() {
    return {
      listLoading: false,
      pageSize: 10,
      total: 0,
      list: [],
      selectList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 分页查询
    fetchData(page = 1) {
      this.listLoading = true
      getAdminList({
        'page': page,
        'pageSize': this.pageSize
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
    // 选择用户
    handleSelectionChange(e) {
      this.selectList = []
      e.map(item => {
        this.selectList.push(item)
      })
    },
    // 删除学员
    del() {
      console.log(this.selectList)
      this.$confirm(`此操作将删除${this.selectList[0].name}管理员账号, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAdmin({
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
    resAdminPwd() {
      resPwd({
        id: this.selectList[0].id
      }).then(res => {
        this.$message({
          type: 'success',
          message: '密码重置成功！密码：trains@888888'
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
