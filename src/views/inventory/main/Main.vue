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
        <a href="#" @click="endMachining(record, '废品')">入废品</a>
        <a-divider type="vertical" />
        <a href="#" @click="endMachining(record, '成品')">入成品</a>
      </span>
    </a-table>
    <a-modal
      title="请检查此单数值是否正确？"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <span v-if="inType == '成品'">
        <div>已入成品：200g | 收发仓当前：500g | 最近入库成品： 200g</div>
        <a-input addonBefore="成品" :value="details.success" />
      </span>
      <span v-if="inType == '废品'">
        <div>已入废品：200g | 此单累计废品：200g</div>
        <a-input addonBefore="废品" :value="details.abandon" />
      </span>
    </a-modal>
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
      confirmLoading: false,
      data: null,
      columns,
      visible: false,
      inType: '',
      details: {
        lost: '',
        abandon: ''
      }
    }
  },
  methods: {
    moment,
    getList () {
      this.$http.get('/api/inventory').then(res => { this.data = res.result })
    },
    endMachining (row, type) {
      this.visible = true
      this.inType = type
      if (type === '成品') this.$http.get(`/api/warehouse/product/order?id=${row.id}`).then(res => { console.log(res) })
      if (type === '废品') this.$http.get(`/api/warehouse/material/order?id=${row.id}`).then(res => { console.log(res) })
    },
    // handleOk (e) {
    //   this.confirmLoading = true
    //   const obj1 = {
    //     name: '板料',
    //     weight: 100,
    //     order_id: 222,
    //     state: '废料'
    //   }
    //   const obj2 = {
    //     name: '板料',
    //     weight: 100,
    //     order_id: 222,
    //     state: '入库'
    //   }
    //   this.$http.get(`/api/warehouse/product/order`, obj).then(res => { this.visible = false; this.confirmLoading = false })
    //   // setTimeout(() => {
    //   //   this.visible = false
    //   //   this.confirmLoading = false
    //   // }, 2000)
    // },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    }
  }
}
</script>
