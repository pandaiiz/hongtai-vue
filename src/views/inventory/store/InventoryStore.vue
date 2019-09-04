<template>
  <div>
    <a-card>
      <a-table :columns="columns" :dataSource="data" :pagination="false" size="middle" :rowKey="(record, index) => index">
      </a-table>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment'
const columns = [
  {
    title: '成色',
    dataIndex: 'quality',
    align: 'center'
  },
  {
    title: '品名',
    dataIndex: 'product',
    align: 'center'
  },
  {
    title: '总重量',
    dataIndex: 'weight',
    align: 'center'
  },
  {
    title: '总数量',
    dataIndex: 'number',
    align: 'center'
  }
]
const data = []

export default {
  data () {
    return {
      data,
      columns
    }
  },
  methods: {
    moment,
    getStatistics () {
      this.$http.get('/api/inventory/store').then(res => { this.data = res.data })
    }
  },
  mounted () {
    this.getStatistics()
  }
}
</script>
