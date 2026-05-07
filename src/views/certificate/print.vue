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
    </div>

    <!-- 打印操作区 -->
    <el-button type="primary" style="margin-top: 20px;" @click="openPrintDialog()">打印</el-button>
    <p>电脑需安装"仿宋_GB2312"、"华文中宋"、"华文行楷"字体，安装好之后重启浏览器，否则影响打印效果！</p>
    <el-link href="http://shiptrains.jvtc.jx.cn:8103/files/receipt/GB2312.TTF" type="primary">点击下载</el-link>

    <!-- 已获证书学员列表 -->
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
      <el-table-column label="身份证号" width="180">
        <template v-slot="scope">
          <span>{{ scope.row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="120">
        <template v-slot="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地区" width="130">
        <template v-slot="scope">
          <span>{{ scope.row.city }}-{{ scope.row.district }}</span>
        </template>
      </el-table-column>
      <el-table-column label="住址">
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
      <el-table-column label="证书" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.certificate" type="success">已获得</el-tag>
          <el-tag v-else type="danger">未获得</el-tag>
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

    <!-- 证件照查看弹窗 -->
    <el-dialog title="证件照" :visible.sync="photoDialogVisible" width="20%">
      <img :src="currentPhoto" alt="img" style="width: 100%;">
    </el-dialog>

    <!-- 打印预览弹窗 -->
    <el-dialog title="证书信息" :visible.sync="printDialogVisible" width="100%">
      <el-progress :percentage="loadingProgress" />
      <br>
      <!-- 证书canvas容器，默认隐藏 -->
      <div class="cer-list" style="display: none;" />
    </el-dialog>
  </div>
</template>

<script>
import { getPhaseList, getStudents, getTrains, getCertificate } from '@/api/trains'

// 证书Canvas绘制坐标配置（基于3508x2480分辨率）
const CERT_LAYOUT = {
  title: { x: 680, y: 610, spacing: 160 },
  image: { x: 845, y: 750, width: 300, height: 420 },
  qrcode: { x: 845, y: 1250, size: 300 },
  info: { x: 520, y: 1750 },
  details: { x: 1890, y: 960, maxWidth: 1100, lineHeight: 160 },
  name: { x: 1890, y: 780 },
  trainUnit: { x: 1850, y: 1850 },
  cerDate: { x: 2100, y: 2000 }
}

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
      // 证件照查看弹窗
      photoDialogVisible: false,
      currentPhoto: '',
      // 打印预览弹窗
      printDialogVisible: false,
      // 证书生成进度百分比
      loadingProgress: 0,
      // 培训期数下拉选项
      phaseOptions: [],
      // 班次下拉选项
      classOptions: [],
      // 已勾选的学员证书ID列表
      selectedCerIds: []
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
        this.classId = res.data[0].trainsClassId
        this.fetchData()
      })
    },

    // 切换期数时重新加载班次
    onPhaseChange() {
      this.loadClassList()
    },

    // 分页查询已获证书学员列表
    fetchData(page = 1) {
      this.listLoading = true
      getStudents({
        'page': page,
        'pageSize': this.pageSize,
        'trainsClassId': this.classId,
        'state': 2,
        'areaReverse': true,
        'unitReverse': true
      }).then(res => {
        this.listLoading = false
        // 只展示已获证书的学员
        this.list = res.data.records.filter(item => item.certificate)
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

    // 打开证件照查看弹窗
    openPhotoDialog(imageUrl) {
      this.currentPhoto = imageUrl
      this.photoDialogVisible = true
    },

    // 打开打印预览弹窗，开始生成证书
    openPrintDialog() {
      this.printDialogVisible = true
      this.generateCertificates()
    },

    // 表格多选变化，收集选中的学员证书ID
    handleSelectionChange(selection) {
      this.selectedCerIds = []
      selection.map(item => {
        this.selectedCerIds.push(item.studentCertificateId)
      })
    },

    // 获取证书数据并生成Canvas
    generateCertificates() {
      getCertificate({
        'ids': this.selectedCerIds,
        'trainsClassId': this.phaseId,
        'trainsId': this.classId
      }).then(res => {
        if (res.data[0].title) {
          this.renderCertificates(res)
        } else {
          this.printDialogVisible = false
          this.$message({
            type: 'error',
            message: '请设置证书信息'
          })
        }
      })
    },

    // 使用Canvas渲染证书
    renderCertificates(res) {
      const container = document.querySelector('.cer-list')
      container.innerHTML = ''
      const layout = CERT_LAYOUT

      // 进度追踪：每个学员有2个异步资源（证件照+二维码）
      let loadedCount = 0
      const totalResources = res.data.length * 2
      const timer = setInterval(() => {
        this.loadingProgress = loadedCount * (100 / totalResources)
        if (loadedCount >= totalResources) {
          clearInterval(timer)
          this.printCertificates()
          this.printDialogVisible = false
        }
      }, 1000 / 60)

      res.data.map(item => {
        const canvas = document.createElement('canvas')
        canvas.width = 3508
        canvas.height = 2480
        container.appendChild(canvas)

        const ctx = canvas.getContext('2d')

        // 绘制证书标题"结业证书"
        ctx.font = 'bold 140px 华文中宋'
        ctx.fillStyle = '#000'
        ctx.fillText('结', layout.title.x, layout.title.y)
        ctx.fillText('业', layout.title.x + layout.title.spacing, layout.title.y)
        ctx.fillText('证', layout.title.x + layout.title.spacing * 2, layout.title.y)
        ctx.fillText('书', layout.title.x + layout.title.spacing * 3, layout.title.y)

        // 绘制证件照
        const image = new Image()
        image.crossOrigin = 'Anonymous'
        image.src = item.image
        image.onload = () => {
          loadedCount++
          ctx.drawImage(image, layout.image.x, layout.image.y, layout.image.width, layout.image.height)
        }

        // 绘制二维码
        const qrcode = new Image()
        qrcode.crossOrigin = 'Anonymous'
        qrcode.src = item.qrcode
        qrcode.onload = () => {
          loadedCount++
          ctx.drawImage(qrcode, layout.qrcode.x, layout.qrcode.y, layout.qrcode.size, layout.qrcode.size)
        }

        // 绘制证书基本信息
        ctx.font = '50px 黑体'
        ctx.fillStyle = '#000'
        ctx.fillText(`培训单位：${item.trainUnit}`, layout.info.x, layout.info.y)
        ctx.fillText(`证书编号：${item.certificateNo}`, layout.info.x, layout.info.y + 90)
        ctx.fillText(`有效期：${item.deadline}`, layout.info.x, layout.info.y + 90 * 2)

        // 绘制姓名
        ctx.font = '92px 华文行楷'
        ctx.fillStyle = '#000'
        ctx.fillText(item.name, layout.name.x, layout.name.y)
        ctx.font = '92px 仿宋_GB2312'
        ctx.fillStyle = '#000'
        ctx.fillText('同志：', layout.name.x + ctx.measureText('哈').width * item.name.length + 20, layout.name.y)

        // 绘制证书正文（支持自动换行）
        const startDate = new Date(item.trainStartDate)
        const startDate2 = new Date(item.startDate)
        const endDate = new Date(item.trainEndDate)
        let detailsText
        if (item.special_content) {
          detailsText = `     ${item.special_content}`
        } else {
          detailsText = `    于${startDate.getFullYear()}年${(startDate.getMonth() + 1).toString().padStart(2, '0')}月${startDate.getDate().toString().padStart(2, '0')}日至${endDate.getFullYear()}年${(endDate.getMonth() + 1).toString().padStart(2, '0')}月${endDate.getDate().toString().padStart(2, '0')}日，参加${item.title}，经考核合格，准予结业。`
        }

        ctx.font = '99px 仿宋_GB2312'
        ctx.fillStyle = 'black'
        const words = detailsText.split('')
        let line = ''
        const lines = []
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n]
          const testWidth = ctx.measureText(testLine).width
          if (testWidth > layout.details.maxWidth && n > 0) {
            lines.push(line)
            line = words[n]
          } else {
            line = testLine
          }
        }
        lines.push(line)
        ctx.save()
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], layout.details.x, layout.details.y + i * layout.details.lineHeight)
        }
        ctx.restore()

        // 绘制发证单位
        ctx.font = '75px 仿宋_GB2312'
        ctx.fillStyle = '#000'
        ctx.fillText(item.trainUnit, layout.trainUnit.x, layout.trainUnit.y)

        // 绘制发证日期
        ctx.font = '75px 仿宋_GB2312'
        ctx.fillStyle = '#000'
        ctx.fillText(`${startDate2.getFullYear()}年${startDate2.getMonth() + 1}月${startDate2.getDate()}日`, layout.cerDate.x, layout.cerDate.y)
      })
    },

    // 将Canvas转为图片并调用浏览器打印
    printCertificates() {
      const container = document.querySelector('.cer-list')
      const canvases = container.getElementsByTagName('canvas')
      const printWindow = window.open('', '', 'width=3508,height=2400')
      printWindow.document.write('<html><body><style>body { margin: 0; padding: 0; } @page { size: landscape; margin: 0;} img { width: 100%; height: auto; display: block;}</style>')
      Array.from(canvases).forEach(canvas => {
        printWindow.document.write('<img src="' + canvas.toDataURL('image/png') + '" style="width:100%;height:auto;" />')
      })
      printWindow.document.write('</body></html>')
      printWindow.document.close()
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
      }, 1)
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

.dialog-footer {
  text-align: right;
}
</style>
