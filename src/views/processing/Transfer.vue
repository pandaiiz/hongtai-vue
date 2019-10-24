<template>
  <a-card>
    <a-range-picker @change="onChange" :defaultValue="[moment(), moment()]" />
    <a-table :columns="columns" :dataSource="data" :rowKey="(record) => record._id" :pagination="false">
      <a slot="transferId" slot-scope="text" href="javascript:;">{{ text }}</a>
      <span slot="createTime" slot-scope="text">{{ moment(text).format('MM-DD HH:mm') }}</span>
      <!-- <span slot="action" slot-scope="text, record">
        <a href="javascript:;">Invite 一 {{ record.name }}</a>
        <a-divider type="vertical" />
        <a href="javascript:;">Delete</a>
        <a-divider type="vertical" />
        <a href="javascript:;" class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
      </span> -->
    </a-table>
  </a-card>
</template>
<script>
import moment from 'moment'
const columns = [
  {
    title: '传递单号',
    dataIndex: 'transferId',
    key: 'transferId',
    scopedSlots: { customRender: 'transferId' }
  },
  {
    title: '数量',
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: '产品',
    dataIndex: 'product',
    key: 'product'
  },
  {
    title: '成色',
    key: 'quality',
    dataIndex: 'quality'
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  data () {
    return {
      data: [],
      columns,
      dateFormat: 'YYYY/MM/DD'
    }
  },
  created () {
    this.getData()
  },
  methods: {
    moment,
    async getData () {
      const res = await this.$http.get('/admin/api/rest/transfers')
      this.data = res
    },
    onChange (date) {
      console.log(date)
    }
  }
}
</script>
