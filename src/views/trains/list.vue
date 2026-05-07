<template>
  <div class="app-container">
    <!-- 操作按钮 -->
    <div class="btn">
      <el-button type="primary" @click="openDialog('dialog1')">新增</el-button>
    </div>

    <!-- 培训列表 -->
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
      <el-table-column label="名称">
        <template v-slot="scope">
          <span>{{ scope.row.trainsTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template v-slot="scope">
          <el-popover effect="light" placement="top" :content="scope.row.trainsContent" trigger="hover">
            <span slot="reference">{{ scope.row.trainsContent.slice(0, 54) + '......' }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template v-slot="scope">
          <span>{{ scope.row.trainsAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学时(小时)" width="100">
        <template v-slot="scope">
          <span>{{ scope.row.trainsHour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开班次数" width="80">
        <template v-slot="scope">
          <span>{{ scope.row.trainsCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开启报名" width="80">
        <template v-slot="scope">
          <el-tag v-if="scope.row.start" type="success">开启</el-tag>
          <el-tag v-else type="danger">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template v-slot="scope">
          <div class="btn">
            <el-button type="primary" icon="el-icon-edit" circle @click="openDialog('dialog2', scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.row.trainsId, scope.row.trainsTitle)" />
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
      :page-sizes="[20, 30, 50, 100, 200]"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- 新增培训弹窗 -->
    <el-dialog title="新增培训" :visible.sync="dialogVisible1" width="50%" @close="resetForm('form1')">
      <el-form ref="form1" :model="form1" :rules="formRules">
        <el-form-item label="培训名称" :label-width="labelWidth" prop="trainsTitle">
          <el-input v-model="form1.trainsTitle" autocomplete="off" placeholder="请输入培训名称" />
        </el-form-item>
        <el-form-item label="培训内容" :label-width="labelWidth" prop="trainsContent">
          <el-input v-model="form1.trainsContent" type="textarea" rows="5" autocomplete="off" placeholder="请描述培训内容" />
        </el-form-item>
        <el-form-item label="培训地址" :label-width="labelWidth" prop="trainsAddress">
          <el-input v-model="form1.trainsAddress" autocomplete="off" placeholder="请输入培训地址" />
        </el-form-item>
        <el-form-item label="学时（小时）" :label-width="labelWidth" prop="trainsHour">
          <el-input v-model="form1.trainsHour" type="number" autocomplete="off" placeholder="请输入数字（小时）" />
        </el-form-item>
        <el-form-item label="开启报名" :label-width="labelWidth">
          <el-switch v-model="form1.start" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="submitForm('form1')">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 编辑培训弹窗 -->
    <el-dialog title="编辑期数" :visible.sync="dialogVisible2" width="50%" @close="resetForm('form2')">
      <el-form ref="form2" :model="form2" :rules="formRules">
        <el-form-item label="培训名称" :label-width="labelWidth" prop="trainsTitle">
          <el-input v-model="form2.trainsTitle" autocomplete="off" placeholder="请输入培训名称" />
        </el-form-item>
        <el-form-item label="培训内容" :label-width="labelWidth" prop="trainsContent">
          <el-input v-model="form2.trainsContent" type="textarea" rows="5" autocomplete="off" placeholder="请描述培训内容" />
        </el-form-item>
        <el-form-item label="培训地址" :label-width="labelWidth" prop="trainsAddress">
          <el-input v-model="form2.trainsAddress" autocomplete="off" placeholder="请输入培训地址" />
        </el-form-item>
        <el-form-item label="学时（小时）" :label-width="labelWidth" prop="trainsHour">
          <el-input v-model="form2.trainsHour" type="number" autocomplete="off" placeholder="请输入数字（小时）" />
        </el-form-item>
        <el-form-item label="开启报名" :label-width="labelWidth">
          <el-switch v-model="form2.start" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogVisible2 = false">关闭</el-button>
          <el-button type="primary" @click="submitForm('form2')">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getPhaseList, addPhase, removePhase, editPhase } from '@/api/trains'
import cloneDeep from 'lodash/cloneDeep'

export default {
  data() {
    return {
      // 培训列表数据
      list: [],
      listLoading: false,
      // 分页
      total: 0,
      pageSize: 20,
      // 表单标签宽度
      labelWidth: '120px',
      // 弹窗显示状态
      dialogVisible1: false,
      dialogVisible2: false,
      // 新增表单
      form1: {
        trainsTitle: '',
        trainsContent: '',
        trainsAddress: '',
        trainsHour: '',
        start: true
      },
      // 编辑表单（打开弹窗时赋值）
      form2: {},
      // 表单校验规则
      formRules: {
        trainsTitle: [
          { required: true, message: '请输入培训标题', trigger: 'blur' }
        ],
        trainsContent: [
          { required: true, message: '请描述培训内容', trigger: 'blur' }
        ],
        trainsAddress: [
          { required: true, message: '请描述培训地址', trigger: 'blur' }
        ],
        trainsHour: [
          { required: true, message: '请输入培训时长', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 分页查询培训列表
    fetchData(page = 1) {
      this.listLoading = true
      getPhaseList({
        'page': page,
        'pageSize': this.pageSize,
        'state': 1
      }).then(response => {
        this.total = response.data.total
        this.list = response.data.records
        this.listLoading = false
      })
    },

    // 翻页
    handlePageChange(page) {
      this.fetchData(page)
    },

    // 切换每页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    // 打开弹窗：dialog1新增，dialog2编辑
    openDialog(dialog, trains) {
      if (dialog === 'dialog1') {
        this.dialogVisible1 = true
      } else if (dialog === 'dialog2') {
        this.form2 = cloneDeep(trains)
        this.dialogVisible2 = true
      }
    },

    // 提交表单，根据表单名区分新增和编辑
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = this[formName]
          if (formName === 'form1') {
            addPhase(formData).then(res => {
              this.dialogVisible1 = false
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.resetForm(formName)
              this.fetchData()
            })
          }
          if (formName === 'form2') {
            editPhase(this.form2).then(res => {
              this.dialogVisible2 = false
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

    // 删除培训
    del(id, name) {
      this.$confirm(`此操作将永久删除${name}, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removePhase({
          id: id
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      })
    }
  }
}
</script>

<style scoped>
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
