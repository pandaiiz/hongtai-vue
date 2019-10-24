<template>
  <div>
    <a-card>
      <a-row>
        <a-range-picker @change="onChange" :defaultValue="defaultValue" />
      </a-row>
      <br />
      <a-table :columns="columns" :dataSource="data" :pagination="false" size="middle" :rowKey="record => record.department">
      </a-table>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment'
const columns = [
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department'
  },
  {
    title: '成品',
    dataIndex: '成品',
    key: '成品'
  },
  {
    title: '半成品',
    dataIndex: '半成品',
    key: '半成品'
  },
  {
    title: '废品',
    dataIndex: '废品',
    key: '废品'
  },
  {
    title: '退货',
    dataIndex: '退货',
    key: '退货'
  },
  {
    title: '损耗',
    dataIndex: 'lost',
    key: 'lost'
  }
]
const data = []

export default {
  data () {
    return {
      defaultValue: [moment(), moment()],
      data,
      columns
    }
  },
  created () {
    this.getData(moment().startOf('day').format('x'), moment().endOf('day').format('x'))
  },
  methods: {
    moment,
    getData (startTime, endTime) {
      this.$http.get(`/admin/api/interval/transfer_records?startTime=${startTime}&endTime=${endTime}`)
        .then(res => {
          res.forEach((val) => {
            Object.assign(val, val._id)
          })
          const arr1 = []
          const result = []
          res.forEach(v => {
            if (arr1.indexOf(v.department) < 0) {
              arr1.push(v.department)
              result.push({ department: v.department })
            }
          })
          res.forEach(v => {
            const item = result.find(val => val.department === v.department)
            item[v.category] = v.total
          })
          result.forEach((val) => {
            let lost = 0
            for (const opt in val) {
              if (typeof (val[opt]) === 'number') {
                lost += val[opt]
              }
            }
            val.lost = lost
          })
          this.data = result
        })
    },
    onChange (date) {
      const startTime = moment(date[0]).startOf('day').format('x')
      const endTime = moment(date[1]).endOf('day').format('x')
      this.getData(startTime, endTime)
    }
  }
}
</script>
