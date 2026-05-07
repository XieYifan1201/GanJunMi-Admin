<template>
  <div class="dashboard">
    <!-- 统计卡片区域 -->
    <div class="statistics">
      <el-card v-for="item in statistics" :key="item.label" class="box-card">
        <div slot="header" class="clearfix">
          <i :class="item.icon" class="stat-icon" />
          <span>{{ item.label }}</span>
        </div>
        <div class="text">{{ item.value }}</div>
      </el-card>
    </div>

    <!-- 柱状图区域 -->
    <div class="charts">
      <div ref="barChart" style="width: 100%; height: 400px;" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getPhaseList, getclass } from '@/api/trains'
import { getStuList } from '@/api/student'

export default {
  data() {
    return {
      // 首页统计项，分别对应开设培训、开设期数、学员总数
      statistics: [
        { label: '开设培训', value: 0, icon: 'el-icon-s-claim' },
        { label: '开设期数', value: 0, icon: 'el-icon-s-goods' },
        { label: '学员总数', value: 0, icon: 'el-icon-user' }
      ]
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initbarChart()
  },
  methods: {
    // 获取统计数据：培训数量、期数数量、学员数量
    getData() {
      getPhaseList({
        'page': 1,
        'pageSize': 99999999,
        'state': 1
      }).then(res => {
        this.statistics[0].value = res.data.total
      })

      getStuList({
        'page': 1,
        'pageSize': 99999999
      }).then(res => {
        this.statistics[2].value = res.data.total
      })
    },

    // 初始化柱状图，展示各培训班报名人数
    initbarChart() {
      const chart = echarts.init(this.$refs.barChart)
      const option = {
        title: {
          text: '各培训班报名人数'
        },
        tooltip: {},
        legend: {
          data: ['人数']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '人数',
          type: 'bar',
          data: []
        }]
      }

      getclass({
        'page': 1,
        'pageSize': 99999999
      }).then(res => {
        // 同时更新期数统计
        this.statistics[1].value = res.data.total
        // 取最近20条数据显示在图表中
        res.data.records.slice(-20).map(item => {
          option.xAxis.data.push(`${item.trainsTitle}-${item.trainsClassName}`)
          option.series[0].data.push(item.count)
          chart.setOption(option)
        })
      })
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.statistics {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.box-card {
  width: 80%;
  height: 200px;
  margin: 0 auto;
  color: white;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.box-card:nth-of-type(1) {
  background-color: #409EFF;
}

.box-card:nth-of-type(2) {
  background-color: #67C23A;
}

.box-card:nth-of-type(3) {
  background-color: #F56C6C;
}

.clearfix {
  font-size: 25px;
}

.stat-icon {
  font-size: 25px;
  margin-right: 8px;
}

.text {
  padding-top: 20px;
  font-size: 40px;
  font-weight: bold;
}

.charts {
  margin-top: 80px;
}
</style>
