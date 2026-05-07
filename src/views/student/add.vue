<template>
  <div class="app-container">
    <!-- 步骤条 -->
    <el-steps :active="active" simple finish-status="success" style="margin-bottom: 20px; background-color: #C7EDCC;">
      <el-step title="学员信息录入" />
      <el-step title="学员报名培训" />
      <el-step title="学员开票信息" />
    </el-steps>

    <!-- 第一步：学员信息录入 -->
    <el-form v-if="active === 0" ref="form" :model="form" :rules="formRules" class="form">
      <div class="form-grid">
        <div class="form-column">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard" autocomplete="off" placeholder="请输入身份证号" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="form.phone" autocomplete="off" placeholder="请输入手机号码" />
          </el-form-item>
        </div>
        <div class="form-column">
          <el-form-item label="城市" prop="city">
            <br>
            <el-select v-model="city" filterable placeholder="请选择" style="width: 100%;" @change="updataCity">
              <el-option
                v-for="item in CityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区县" prop="district">
            <br>
            <el-select v-model="district" filterable placeholder="请选择" style="width: 100%;" @change="updataDistrict">
              <el-option
                v-for="item in districtsOption[city]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address" autocomplete="off" placeholder="请输入详细地址" />
          </el-form-item>
        </div>
        <div class="form-column">
          <el-form-item label="性别" style="margin-top: 40px;">
            <el-radio v-model="form.sex" label="男">男</el-radio>
            <el-radio v-model="form.sex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="工作单位" prop="workUnit">
            <el-input v-model="form.workUnit" autocomplete="off" placeholder="请输入工作单位" />
          </el-form-item>
        </div>
        <div class="form-column">
          <el-form-item label="证件照" prop="image">
            <el-upload
              class="avatar-uploader"
              :headers="header"
              action="http://shiptrains.jvtc.jx.cn:8103/api/upload"
              name="image"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="form.image" :src="form.image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </div>
    </el-form>

    <!-- 第二步：学员报名培训 -->
    <el-form v-if="active === 1" ref="form2" :model="form2" :rules="formRules2" class="form">
      <el-form-item label="姓名">
        {{ form2.name }}
      </el-form-item>
      <el-form-item label="培训" prop="trainsId">
        <el-select v-model="form2.trainsId" placeholder="请选择培训" @change="getClass()">
          <el-option
            v-for="item in trainsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="期数" prop="trainsClassId">
        <el-select v-model="trainsClassId" placeholder="请选择期数" @change="updataTrains()">
          <el-option
            v-for="item in classOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上传回执单" prop="receiptPath">
        <el-upload
          action="http://shiptrains.jvtc.jx.cn:8103/api/uploadReceipt"
          :headers="header"
          :on-success="handleFileSuccess"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip">上传单位盖章报名表回执jpg/pdf文件</div>
        </el-upload>
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="back()">返回</el-button>
        <el-button type="primary" @click="submitForm('form2')">保存</el-button>
      </div>
    </el-form>

    <!-- 第三步：学员开票信息 -->
    <div v-if="active === 2">
      <!-- 增值税专用发票 -->
      <el-form v-if="special === '1'" ref="form3" :model="form3" :rules="formRules3">
        <el-form-item label="发票类型">
          <el-radio v-model="special" label="1">增值税专用发票</el-radio>
          <el-radio v-model="special" label="2">普通发票</el-radio>
        </el-form-item>
        <el-form-item label="抬头" prop="invoiceHead">
          <el-input v-model="form3.invoiceHead" autocomplete="off" placeholder="请输入抬头" />
        </el-form-item>
        <el-form-item label="税号" prop="invoiceNo">
          <el-input v-model="form3.invoiceNo" autocomplete="off" placeholder="请输入税号" />
        </el-form-item>
        <el-form-item label="银行开户名" prop="bankName">
          <el-input v-model="form3.bankName" autocomplete="off" placeholder="请输入银行开户名" />
        </el-form-item>
        <el-form-item label="银行账号" prop="bangNo">
          <el-input v-model="form3.bangNo" autocomplete="off" placeholder="请输入银行账号" />
        </el-form-item>
        <el-form-item label="公司地址" prop="unitAddress">
          <el-input v-model="form3.unitAddress" autocomplete="off" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="公司电话" prop="unitPhone">
          <el-input v-model="form3.unitPhone" autocomplete="off" placeholder="请输入公司电话" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="back()">返回</el-button>
          <el-button type="primary" @click="submitForm('form3')">保存</el-button>
        </div>
      </el-form>
      <!-- 普通发票 -->
      <el-form v-else ref="form3" :model="form3" :rules="formRules4">
        <el-form-item label="发票类型">
          <el-radio v-model="special" label="1">增值税专用发票</el-radio>
          <el-radio v-model="special" label="2">普通发票</el-radio>
        </el-form-item>
        <el-form-item label="抬头" prop="invoiceHead">
          <el-input v-model="form3.invoiceHead" autocomplete="off" placeholder="请输入抬头" />
        </el-form-item>
        <el-form-item label="税号" prop="invoiceNo">
          <el-input v-model="form3.invoiceNo" autocomplete="off" placeholder="请输入税号" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="back()">返回</el-button>
          <el-button type="primary" @click="submitForm('form3')">确定</el-button>
        </div>
      </el-form>
    </div>

    <!-- 已录入学员列表 -->
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
      <el-table-column label="身份证号" width="165">
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
      <el-table-column label="工作单位" width="230">
        <template v-slot="scope">
          <span>{{ scope.row.workUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件照" width="80">
        <template v-slot="scope">
          <span style="color: #409EFF; cursor: pointer;" @click="openDialog('dialog1', scope.row.image)">查看</span>
        </template>
      </el-table-column>
      <el-table-column label="回执单" width="80">
        <template v-slot="scope">
          <span v-if="scope.row.receiptPath" style="color: #409EFF; cursor: pointer;" @click="download(scope.row.receiptPath)">下载</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="报名培训" width="300">
        <template v-slot="scope">
          <span>{{ scope.row.trainsTitle }} - {{ scope.row.trainsClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票类型悬浮查看" width="80">
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
      <el-table-column label="操作" width="120">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="edit(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.row.id, scope.row.name)" />
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

    <!-- 证件照弹窗 -->
    <el-dialog title="证件照" :visible.sync="dialogVisible1" width="20%">
      <img :src="img" alt="img" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { addStuList, getStuList2, editStuList, regStu, editInvoice, regStu2, delStuList } from '@/api/student'
import { getPhaseList, getTrains } from '@/api/trains'
import cloneDeep from 'lodash/cloneDeep'

export default {
  data() {
    return {
      // 回执单文件列表
      fileList: [],
      // 当前步骤（0:信息录入, 1:报名培训, 2:开票信息）
      active: 0,
      // 上传请求头，携带token鉴权
      header: { 'token': getToken() },
      // 列表加载状态
      listLoading: false,
      // 学员列表数据
      list: [],
      total: 0,
      pageSize: 10,
      // 证件照弹窗
      dialogVisible1: false,
      img: '',
      // 地区选择
      city: '',
      district: '',
      // 是否为编辑模式
      isEdit: false,

      // ---- 第一步：学员基本信息 ----
      form: {
        name: '',
        idCard: '',
        sex: '男',
        phone: '',
        address: '',
        workUnit: '',
        image: '',
        city: '',
        district: ''
      },
      formRules: {
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
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'blur' }
        ],
        district: [
          { required: true, message: '请选择区县', trigger: 'blur' }
        ]
      },

      // ---- 第二步：报名培训 ----
      trainsOptions: [],
      classOptions: [],
      form2: {},
      formRules2: {
        trainsId: [
          { required: true, message: '请选择培训', trigger: 'blur' }
        ],
        trainsClassId: [
          { required: true, message: '请选择期数', trigger: 'blur' }
        ],
        receiptPath: [
          { required: true, message: '请上传回执单', trigger: 'blur' }
        ]
      },
      trainsClassId: null,

      // ---- 第三步：开票信息 ----
      // 发票类型：1=增值税专用发票，2=普通发票
      special: '1',
      form3: {
        special: true
      },
      // 专用发票校验规则
      formRules3: {
        invoiceHead: [
          { required: true, message: '请选择期数', trigger: 'blur' }
        ],
        invoiceNo: [
          { required: true, message: '请输入税号', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '请输入银行开户名', trigger: 'blur' }
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
      // 普通发票校验规则
      formRules4: {
        invoiceHead: [
          { required: true, message: '请选择期数', trigger: 'blur' }
        ],
        invoiceNo: [
          { required: true, message: '请输入税号', trigger: 'blur' }
        ]
      },

      // ---- 城市/区县数据 ----
      CityOptions: [
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
      districtsOption: {
        '': [{ value: '请选择城市', label: '请选择城市' }],
        '南昌市': [
          { value: '东湖区', label: '东湖区' },
          { value: '西湖区', label: '西湖区' },
          { value: '青云谱区', label: '青云谱区' },
          { value: '湾里区', label: '湾里区' },
          { value: '青山湖区', label: '青山湖区' },
          { value: '新建区', label: '新建区' },
          { value: '南昌县', label: '南昌县' },
          { value: '安义县', label: '安义县' },
          { value: '进贤县', label: '进贤县' }
        ],
        '九江市': [
          { value: '浔阳区', label: '浔阳区' },
          { value: '濂溪区', label: '濂溪区' },
          { value: '柴桑区', label: '柴桑区' },
          { value: '永修县', label: '永修县' },
          { value: '德安县', label: '德安县' },
          { value: '都昌县', label: '都昌县' },
          { value: '湖口县', label: '湖口县' },
          { value: '彭泽县', label: '彭泽县' },
          { value: '武宁县', label: '武宁县' },
          { value: '修水县', label: '修水县' },
          { value: '瑞昌市', label: '瑞昌市' },
          { value: '共青城市', label: '共青城市' },
          { value: '庐山市', label: '庐山市' }
        ],
        '上饶市': [
          { value: '信州区', label: '信州区' },
          { value: '广丰区', label: '广丰区' },
          { value: '广信区', label: '广信区' },
          { value: '玉山县', label: '玉山县' },
          { value: '铅山县', label: '铅山县' },
          { value: '横峰县', label: '横峰县' },
          { value: '弋阳县', label: '弋阳县' },
          { value: '余干县', label: '余干县' },
          { value: '鄱阳县', label: '鄱阳县' },
          { value: '万年县', label: '万年县' },
          { value: '婺源县', label: '婺源县' },
          { value: '德兴市', label: '德兴市' }
        ],
        '抚州市': [
          { value: '临川区', label: '临川区' },
          { value: '东乡区', label: '东乡区' },
          { value: '南城县', label: '南城县' },
          { value: '黎川县', label: '黎川县' },
          { value: '南丰县', label: '南丰县' },
          { value: '崇仁县', label: '崇仁县' },
          { value: '乐安县', label: '乐安县' },
          { value: '宜黄县', label: '宜黄县' },
          { value: '金溪县', label: '金溪县' },
          { value: '资溪县', label: '资溪县' },
          { value: '广昌县', label: '广昌县' }
        ],
        '宜春市': [
          { value: '袁州区', label: '袁州区' },
          { value: '高安市', label: '高安市' },
          { value: '丰城市', label: '丰城市' },
          { value: '樟树市', label: '樟树市' },
          { value: '奉新县', label: '奉新县' },
          { value: '万载县', label: '万载县' },
          { value: '上高县', label: '上高县' },
          { value: '宜丰县', label: '宜丰县' },
          { value: '靖安县', label: '靖安县' },
          { value: '铜鼓县', label: '铜鼓县' }
        ],
        '吉安市': [
          { value: '吉州区', label: '吉州区' },
          { value: '青原区', label: '青原区' },
          { value: '吉安县', label: '吉安县' },
          { value: '井冈山市', label: '井冈山市' },
          { value: '吉水县', label: '吉水县' },
          { value: '新干县', label: '新干县' },
          { value: '永丰县', label: '永丰县' },
          { value: '泰和县', label: '泰和县' },
          { value: '遂川县', label: '遂川县' },
          { value: '万安县', label: '万安县' },
          { value: '安福县', label: '安福县' },
          { value: '永新县', label: '永新县' },
          { value: '峡江县', label: '峡江县' }
        ],
        '赣州市': [
          { value: '章贡区', label: '章贡区' },
          { value: '南康区', label: '南康区' },
          { value: '赣县区', label: '赣县区' },
          { value: '信丰县', label: '信丰县' },
          { value: '大余县', label: '大余县' },
          { value: '龙南县', label: '龙南县' },
          { value: '定南县', label: '定南县' },
          { value: '全南县', label: '全南县' },
          { value: '寻乌县', label: '寻乌县' },
          { value: '安远县', label: '安远县' },
          { value: '瑞金市', label: '瑞金市' },
          { value: '宁都县', label: '宁都县' },
          { value: '于都县', label: '于都县' },
          { value: '会昌县', label: '会昌县' },
          { value: '石城县', label: '石城县' },
          { value: '上犹县', label: '上犹县' },
          { value: '兴国县', label: '兴国县' },
          { value: '崇义县', label: '崇义县' }
        ],
        '景德镇市': [
          { value: '珠山区', label: '珠山区' },
          { value: '昌江区', label: '昌江区' },
          { value: '浮梁县', label: '浮梁县' },
          { value: '乐平市', label: '乐平市' }
        ],
        '萍乡市': [
          { value: '安源区', label: '安源区' },
          { value: '湘东区', label: '湘东区' },
          { value: '莲花县', label: '莲花县' },
          { value: '上栗县', label: '上栗县' },
          { value: '芦溪县', label: '芦溪县' }
        ],
        '新余市': [
          { value: '渝水区', label: '渝水区' },
          { value: '分宜县', label: '分宜县' }
        ],
        '鹰潭市': [
          { value: '月湖区', label: '月湖区' },
          { value: '余江区', label: '余江区' },
          { value: '贵溪市', label: '贵溪市' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
    this.getPhase()
  },
  methods: {
    // 证件照上传成功回调
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.$message({
          'type': 'error',
          'message': res.msg
        })
      }
      this.form.image = res.data
    },

    // 回执单上传成功回调
    handleFileSuccess(res, file) {
      this.form2.receiptPath = res.data
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    // 提交表单，根据步骤和编辑模式走不同接口
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = this[formName]
          if (formName === 'form') {
            this.next()
            window.scrollTo(0, 0)
            if (this.isEdit) {
              editStuList(formData).then(res => {
                this.$message({ type: 'success', message: '保存成功!' })
                this.form = {}
                this.fetchData()
                this.resetForm(formName)
              })
            } else {
              this.form2 = this.form
              this.form3.idCard = this.form.idCard
              addStuList(formData).then(res => {
                this.$message({ type: 'success', message: '保存成功!' })
                this.form = {}
                this.fetchData()
                this.resetForm(formName)
              })
            }
          }
          if (formName === 'form2') {
            if (this.isEdit) {
              regStu(formData).then(res => {
                this.next()
                window.scrollTo(0, 0)
                this.$message({ type: 'success', message: '保存成功!' })
                this.form2 = {}
                this.fetchData()
                this.resetForm(formName)
              })
            } else {
              regStu2(formData).then(res => {
                this.next()
                window.scrollTo(0, 0)
                this.$message({ type: 'success', message: '保存成功!' })
                this.form2 = {}
                this.fetchData()
                this.resetForm(formName)
              })
            }
          }
          if (formName === 'form3') {
            if (this.special === '1') formData.special = true
            if (this.special === '2') formData.special = false
            editInvoice(formData).then(res => {
              this.active = 0
              window.scrollTo(0, 0)
              this.$message({ type: 'success', message: '保存成功!' })
              this.add()
            })
          }
        } else {
          return false
        }
      })
    },

    // 同步期数选择到表单
    updataTrains() {
      this.form2.trainsClassId = this.trainsClassId
      this.form2.trainClassId = this.trainsClassId
    },

    // 同步城市选择到表单
    updataCity() {
      this.form.city = this.city
    },

    // 同步区县选择到表单
    updataDistrict() {
      this.form.district = this.district
    },

    // 返回第一步
    back() {
      this.add()
    },

    // 步骤+1
    next() {
      this.active += 1
    },

    // 重置页面，开始新增学员
    add() {
      location.reload()
    },

    // 删除学员
    del(id, name) {
      this.$confirm(`此操作将永久删除${name}, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delStuList({ id: id }).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
          this.fetchData()
        })
      })
    },

    // 打开证件照弹窗
    openDialog(dialog, data) {
      if (dialog === 'dialog1') {
        this.img = data
        this.dialogVisible1 = true
      }
    },

    // 下载回执单
    download(url) {
      window.open(url)
    },

    // 分页查询学员列表
    fetchData(page = 1) {
      this.listLoading = true
      getStuList2({
        'page': page,
        'pageSize': this.pageSize,
        'reverse': true
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

    // 进入编辑模式，回填表单数据
    edit(data) {
      this.active = 0
      this.isEdit = true
      this.form = cloneDeep(data)
      this.city = this.form.city
      this.district = this.form.district
      this.form2 = cloneDeep(data)
      this.form2.trainClassId = this.form2.trainsClassId
      this.form2.studentId = this.form2.id
      this.trainsClassId = this.form2.trainsClassId
      this.fileList = []
      if (this.form2.receiptPath) this.fileList = [{ name: '回执单', url: this.form2.receiptPath }]
      if (this.form2.studentCertificateId === 0) {
        this.form2.studentCertificateId = null
      }
      this.form3 = cloneDeep(data)
      this.getClass()
    },

    // 获取培训列表，填充下拉选项
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
      })
    },

    // 根据培训ID获取班次列表
    getClass() {
      if (this.form2.trainsId) {
        this.classOptions = []
        getTrains({
          id: this.form2.trainsId
        }).then(res => {
          res.data.map(item => {
            this.classOptions.push({ value: item.trainsClassId, label: item.trainsClassName })
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.table {
  margin-top: 50px;
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
  margin: 0 auto;
  width: 75%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
}

.form-column {
  display: flex;
  flex-direction: column;
}

.form-column .el-form-item {
  margin-bottom: 20px;
}

.form-column .el-form-item:last-child {
  margin-bottom: 0;
}
</style>
