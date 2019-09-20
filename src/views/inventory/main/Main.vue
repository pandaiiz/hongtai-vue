<template>
  <a-card>
    <a-table :columns="columns" :dataSource="data" :rowKey="record => record.id" :pagination="false">
      <span slot="id" slot-scope="text">{{ text }}</span>
      <span slot="create_time" slot-scope="text">{{ moment(text).format('MM-DD HH:mm:ss') }}</span>
      <span slot="end_time" slot-scope="text">{{ text }}</span>
      <span slot="action" slot-scope="text, record">
        <router-link :to="{name:'index', query: { id: record.id }}">
          详情
        </router-link>
        <a-divider type="vertical" />
        <a href="#" @click="endMachining(record)">入总仓</a>
      </span>
    </a-table>
  </a-card>
</template>
<script>
import moment from 'moment'
const columns = [{
  title: '传递单号',
  dataIndex: 'id',
  scopedSlots: { customRender: 'id' },
  align: 'center'
}, {
  title: '成色',
  dataIndex: 'quality',
  align: 'center'
}, {
  title: '产品',
  dataIndex: 'product',
  align: 'center'
}, {
  title: '件数',
  dataIndex: 'number',
  align: 'center'
}, {
  title: '重量',
  dataIndex: 'weight',
  scopedSlots: { customRender: 'weight' },
  align: 'center'
}, {
  title: '当前状态',
  dataIndex: 'state',
  scopedSlots: { customRender: 'state' },
  align: 'center'
}, {
  title: '创建日期',
  dataIndex: 'create_time',
  scopedSlots: { customRender: 'create_time' },
  align: 'center'
}, {
  title: '修改日期',
  dataIndex: 'end_time',
  scopedSlots: { customRender: 'end_time' },
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'action',
  scopedSlots: { customRender: 'action' },
  align: 'center'
}]

export default {
  created () {
    this.getList()
  },
  data () {
    return {
      data: null,
      columns
    }
  },
  methods: {
    moment,
    getList () {
      this.$http.get('/api/inventory').then(res => { this.data = res.result })
    },
    endMachining (row) {
      console.log(row)
      this.$http.post('/api/warehouse/product', row).then(res => console.log(res))
    }
  }
}
</script>
