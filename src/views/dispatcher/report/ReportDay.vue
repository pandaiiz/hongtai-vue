<template>
  <div>
    <a-card>
      <a-row>
        <a-date-picker :defaultValue="moment()" :format="dateFormat" @change="onChange"/>
      </a-row>
      <br />
      <a-table :columns="columns" :dataSource="data" :pagination="false" size="middle" :rowKey="record => record.department">
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { getStatistics } from '@/api/manage'
import moment from 'moment'
const columns = [
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department'
  },
  {
    title: '成品',
    dataIndex: 'cp_weight',
    key: 'cp_weight'
  },
  {
    title: '半成品',
    dataIndex: 'bcp_weight',
    key: 'bcp_weight'
  },
  {
    title: '废品',
    dataIndex: 'fp_weight',
    key: 'fp_weight'
  },
  {
    title: '退货',
    dataIndex: 'th_weight',
    key: 'th_weight'
  },
  {
    title: '粉/线',
    dataIndex: 'lost_fx_weight',
    key: 'lost_fx_weight'
  },
  {
    title: '损耗',
    dataIndex: 'lost_weight',
    key: 'lost_weight'
  }
]
const data = []

export default {
  data () {
    return {
      dateFormat: 'YYYY/MM/DD',
      data,
      columns
    }
  },
  methods: {
    moment,
    onChange (date, dateString) {
      getStatistics({ type: 'date', time: dateString }).then(res => {
        this.data = res.data
      })
    }
  },
  mounted () {
    getStatistics({ type: 'date', time: moment().format('YYYY-MM-DD') }).then(res => {
      this.data = res.data
    })
  }
}
</script>
