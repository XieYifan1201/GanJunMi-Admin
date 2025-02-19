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
    </div>
    <!-- 打印 -->
    <el-button type="primary" style="margin-top: 20px;" @click="openDialog('dialog3')">打印</el-button>
    <p>电脑需安装“仿宋_GB2312”、“华文中宋”、“华文行楷”字体，安装好之后重启浏览器，否则影响打印效果！</p><el-link href="http://shiptrains.jvtc.jx.cn:8103/files/receipt/GB2312.TTF" type="primary">点击下载</el-link>
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
          <img :src="scope.row.image" alt="img" style="height: 80px;" @click="openDialog('dialog2', scope.row.image)">
        </template>
      </el-table-column>
      <el-table-column label="证书" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.certificate" type="success">已获得</el-tag>
          <el-tag v-else type="danger">未获得</el-tag>
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
    <!-- 查看证书 -->
    <el-dialog title="证书信息" :visible.sync="dialogVisible3" width="100%">
      <el-progress :percentage="loading" />
      <br>
      <div class="cerList" style="display: none;" />
    </el-dialog>
  </div>
</template>

<script>
import { getPhaseList, getStudents, getTrains, getCertificate } from '@/api/trains'

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
      // 弹出框状态
      dialogVisible2: false,
      dialogVisible3: false,
      img: '',
      // 期数查询选择
      options: [],
      // 班次选择
      trainsOptions: [],
      // 选中的报名学员
      stuCerList: [],
      loading: 0
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
        'state': 2,
        'areaReverse': true,
        'unitReverse': true
      }).then(res => {
        this.listLoading = false
        this.list = res.data.records.filter(item => item.certificate)
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
      if (dialog === 'dialog2') {
        this.img = data
        this.dialogVisible2 = true
      }
      if (dialog === 'dialog3') {
        this.dialogVisible3 = true
        this.cer()
      }
    },
    // 选择框
    handleSelectionChange(e) {
      this.stuCerList = []
      e.map(item => {
        this.stuCerList.push(item.studentCertificateId)
      })
    },
    cer() {
      getCertificate({
        'ids': this.stuCerList,
        'trainsClassId': this.id,
        'trainsId': this.trainsId
      }).then(res => {
        // 查看证书
        if (res.data[0].title) {
          this.viewCer(res)
        } else {
          this.dialogVisible3 = false
          this.$message({
            type: 'error',
            message: '请设置证书信息'
          })
        }
      })
    },
    viewCer(res) {
      // canvas生成证书
      const container = document.querySelector('.cerList')
      container.innerHTML = ''
      const text = {
        title: {
          x: 680,
          y: 610,
          spacing: 160
        },
        image: {
          x: 845,
          y: 750,
          size: 60
        },
        qrcode: {
          x: 845,
          y: 1250,
          size: 300
        },
        info: {
          x: 520,
          y: 1750
        },
        details: {
          x: 1890,
          y: 960,
          maxWidth: 1100,
          lineHeight: 160
        },
        name: {
          x: 1890,
          y: 780
        },
        trainUnit: {
          x: 1850,
          y: 1850
        },
        cerDate: {
          x: 2100,
          y: 2000
        }
      }
      let loading = 0
      const timer = setInterval(() => {
        this.loading = loading * (100 / (res.data.length * 3))
        if (res.data.length * 2 === loading) {
          clearInterval(timer)
          this.printCer()
          this.dialogVisible3 = false
        }
      }, 1000 / 60)
      res.data.map(item => {
        // 创建canvas添加到div中
        const canvas = document.createElement('canvas')
        canvas.width = 3508
        canvas.height = 2480
        container.appendChild(canvas)

        // 绘制
        const ctx = canvas.getContext('2d')
        // 证书标题
        ctx.font = 'bold 140px 华文中宋'
        ctx.fillStyle = '#000'
        ctx.fillText('结', text.title.x, text.title.y)
        ctx.fillText('业', text.title.x + text.title.spacing, text.title.y)
        ctx.fillText('证', text.title.x + text.title.spacing * 2, text.title.y)
        ctx.fillText('书', text.title.x + text.title.spacing * 3, text.title.y)
        // 证件照
        const image = new Image()
        image.crossOrigin = 'Anonymous'
        image.src = item.image
        image.onload = () => {
          loading++
          ctx.drawImage(image, text.image.x, text.image.y, text.image.size * 5, text.image.size * 7)
        }
        // 二维码
        const qrcode = new Image()
        qrcode.crossOrigin = 'Anonymous'
        qrcode.src = item.qrcode
        qrcode.onload = () => {
          loading++
          ctx.drawImage(qrcode, text.qrcode.x, text.qrcode.y, text.qrcode.size, text.qrcode.size)
        }
        // 证书信息
        ctx.font = '50px 黑体'
        ctx.fillStyle = '#000'
        ctx.fillText(`培训单位：${item.trainUnit}`, text.info.x, text.info.y)
        ctx.fillText(`证书编号：${item.certificateNo}`, text.info.x, text.info.y + 90)
        ctx.fillText(`有效期：${item.deadline}`, text.info.x, text.info.y + 90 * 2)
        // 姓名
        ctx.font = '92px 华文行楷'
        ctx.fillStyle = '#000'
        ctx.fillText(item.name, text.name.x, text.name.y)
        ctx.font = '92px 仿宋_GB2312'
        ctx.fillStyle = '#000'
        ctx.fillText('同志：', text.name.x + ctx.measureText('哈').width * item.name.length + 20, text.name.y)
        // 证书详细信息（自动换行）
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
          if (testWidth > text.details.maxWidth && n > 0) {
            lines.push(line)
            line = words[n]
          } else {
            line = testLine
          }
        }
        lines.push(line)
        ctx.save()
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], text.details.x, text.details.y + i * text.details.lineHeight)
        }
        ctx.restore()
        // 发证单位
        ctx.font = '75px 仿宋_GB2312'
        ctx.fillStyle = '#000'
        ctx.fillText(item.trainUnit, text.trainUnit.x, text.trainUnit.y)
        // 发证时间
        ctx.font = '75px 仿宋_GB2312'
        ctx.fillStyle = '#000'
        ctx.fillText(`${startDate2.getFullYear()}年${startDate2.getMonth() + 1}月${startDate2.getDate()}日`, text.cerDate.x, text.cerDate.y)
      })
    },
    // 打印证书
    printCer() {
      const container = document.querySelector('.cerList')
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
