<template>
  <a-card>
    <a-table :columns="columns" :dataSource="data" :rowKey="record => record.id" :pagination="false">
      <span slot="id" slot-scope="text">{{ text }}</span>
      <span slot="state" slot-scope="text">{{ text === null ? '未入总仓' : '入总仓' }}</span>
      <span slot="weight" slot-scope="text, record">{{ record.type === 'send' ? '发' : '收' }} {{ text }} <span v-if="text">g</span></span>
      <span slot="create_time" slot-scope="text">{{ moment(text).format('MM-DD HH:mm:ss') }}</span>
      <span slot="update_time" slot-scope="text">{{ moment(text).format('MM-DD HH:mm:ss') }}</span>
      <span slot="action" slot-scope="text, record">
        <router-link :to="{name:'index', query: { id: record.id }}">
          详情
        </router-link>
        <a-divider type="vertical" />
        <a href="#" @click="putStore(record)">入总仓</a>
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
  title: '当前部门',
  dataIndex: 'department',
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
  title: '当前损耗/未收回',
  dataIndex: 'lost',
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
  dataIndex: 'update_time',
  scopedSlots: { customRender: 'update_time' },
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'action',
  scopedSlots: { customRender: 'action' },
  align: 'center'
}]

export default {
  created () {
    this.getData()
  },
  data () {
    return {
      data: null,
      columns
    }
  },
  methods: {
    moment,
    getData () {
      this.$http.get('/api/inventory').then(res => { this.data = res.data })
    },
    putStore (row) {
      this.$http.post('/api/putStore', row).then(res => console.log(res))
    }
  }
}
</script>
