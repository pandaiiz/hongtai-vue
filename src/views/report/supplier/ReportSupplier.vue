<template>
  <a-table :columns="columns" :dataSource="data" bordered :pagination="false" :rowKey="record => record.custom_code">
    <template slot="title">
      <a-range-picker
        @change="dateChange"
        v-model="dateValue"
        :format="dateFormat"/>
    </template>
    <template slot="earn" slot-scope="text, record">
      {{ (parseFloat(record.inCost) - parseFloat(record.outCost)).toFixed(2) }}
    </template>
  </a-table>
</template>
<script>
import moment from 'moment'
const columns = [{
  title: '名称',
  dataIndex: 'custom_name'
}, {
  title: '入库',
  dataIndex: 'inCost'
}, {
  title: '出库',
  dataIndex: 'outCost'
}, {
  title: '差值',
  dataIndex: 'earn',
  scopedSlots: { customRender: 'earn' }
}]

export default {
  data () {
    return {
      moment,
      dateValue: [],
      dateFormat: 'YYYY-MM-DD',
      data: [],
      columns
    }
  },
  created () {
    this.dateValue = [moment().startOf('month'), moment().endOf('month')]
    this.getData(this.dateValue[0], this.dateValue[1])
  },
  methods: {
    dateChange (date, value) {
      this.getData(this.dateValue[0], this.dateValue[1])
    },
    getData (startTime, endTime) {
      this.$http.get(`/api/report?type=supplier&startTime=${startTime.format('YYYY-MM-DD 00:00:00')}&endTime=${endTime.format('YYYY-MM-DD 23:59:59')}`).then(res => { this.data = res.data })
    }
  }
}
</script>
<style>
</style>
