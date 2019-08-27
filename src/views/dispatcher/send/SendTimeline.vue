<template>
  <a-card>
    <router-link :to="{ name:'SendReceive' }">
      <a-button type="primary">
        <a-icon type="left" />收发管理
      </a-button>
    </router-link>
    <a-divider />
    <a-table :columns="statisticColums" :dataSource="statisticData" size="small" :pagination="false"/>
    <a-divider />
    <a-table :columns="columns" :dataSource="data" :pagination="false">
      <template slot="timestamp" slot-scope="text">
        {{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template slot="type" slot-scope="text">
        {{ text === 'send' ? '发货' : '收货' }}
      </template>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '时间',
    dataIndex: 'timestamp',
    scopedSlots: { customRender: 'timestamp' }
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'department',
    scopedSlots: { customRender: 'department' }
  },
  {
    align: 'center',
    title: '类别',
    dataIndex: 'category',
    scopedSlots: { customRender: 'category' }
  },
  {
    align: 'center',
    title: '类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    align: 'center',
    title: '成色',
    dataIndex: 'quality',
    scopedSlots: { customRender: 'quality' }
  },
  {
    align: 'center',
    title: '产品',
    dataIndex: 'product',
    scopedSlots: { customRender: 'product' }
  },
  {
    align: 'center',
    title: '重量(g)',
    dataIndex: 'weight',
    scopedSlots: { customRender: 'weight' }
  },
  {
    align: 'center',
    title: '件数',
    dataIndex: 'number',
    scopedSlots: { customRender: 'number' }
  }
]
const statisticColums = [
  {
    title: '半成品',
    dataIndex: 'bcp_weight'
  }, {
    title: '成品',
    dataIndex: 'cp_weight'
  }, {
    title: '废品',
    dataIndex: 'fp_weight'
  }, {
    title: '退货',
    dataIndex: 'th_weight'
  }, {
    title: '损耗',
    dataIndex: 'lost_weight'
  }
]

export default {
  data () {
    return {
      data: [],
      ending: '待完成...',
      columns,
      statisticColums,
      statisticData: []
    }
  },
  created () {
    this.getSendById(this.$route.query.id)
    this.getStatisticById(this.$route.query.id)
  },
  methods: {
    moment,
    getSendById (id) {
      this.$http.get(`/api/data?id=${id}`).then(res => { this.data = res.data })
    },
    getStatisticById (id) {
      this.$http.get(`/api/data/statistic?id=${id}`).then(res => { res.data.map((val, key) => { val['key'] = key }); this.statisticData = res.data })
    }
  }
}
</script>

<style>

</style>
