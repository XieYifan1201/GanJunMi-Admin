<template>
  <div class="app-container">
    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button type="primary" :disabled="selectList.length !== 1" @click="resetPassword()">重置密码</el-button>
      <el-button type="danger" style="margin-left: 20px;" :disabled="selectList.length !== 1" @click="deleteAdmin()">删除账号</el-button>
    </div>

    <!-- 管理员列表 -->
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
  </div>
</template>

<script>
import { getAdminList, delAdmin, resPwd } from '@/api/admin'

export default {
  data() {
    return {
      // 列表加载状态
      listLoading: false,
      // 分页相关
      pageSize: 10,
      total: 0,
      // 管理员列表数据
      list: [],
      // 当前选中的管理员列表
      selectList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 分页查询管理员列表
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

    // 切换页码
    handlePageChange(page) {
      this.fetchData(page)
    },

    // 切换每页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },

    // 表格多选变化
    handleSelectionChange(selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item)
      })
    },

    // 删除管理员账号
    deleteAdmin() {
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

    // 重置管理员密码
    resetPassword() {
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

.action-bar {
  display: flex;
}
</style>
