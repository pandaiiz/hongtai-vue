<template>
  <a-drawer :visible="details" @close="onClose" height="100%" placement="bottom">
    <a-divider />
    <a-table :columns="statisticColums" :dataSource="statisticData" size="small" :pagination="false"/>
    <a-divider />
    <a-table :columns="columns" :dataSource="data" :pagination="false" :scroll="{ y: 450 }" size="small">
      <template slot="timestamp" slot-scope="text">
        {{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template slot="type" slot-scope="text">
        {{ text === 'send' ? '发货' : '收货' }}
      </template>
    </a-table>
  </a-drawer>
</template>

<script>
import moment from 'moment'
const columns = [
  {
    width: 200,
    align: 'center',
    title: '时间',
    dataIndex: 'timestamp',
    scopedSlots: { customRender: 'timestamp' }
  },
  {
    width: 120,
    align: 'center',
    title: '部门',
    dataIndex: 'department',
    scopedSlots: { customRender: 'department' }
  },
  {
    width: 120,
    align: 'center',
    title: '类别',
    dataIndex: 'category',
    scopedSlots: { customRender: 'category' }
  },
  {
    width: 120,
    align: 'center',
    title: '类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    width: 120,
    align: 'center',
    title: '成色',
    dataIndex: 'quality',
    scopedSlots: { customRender: 'quality' }
  },
  {
    width: 120,
    align: 'center',
    title: '产品',
    dataIndex: 'product',
    scopedSlots: { customRender: 'product' }
  },
  {
    width: 120,
    align: 'center',
    title: '重量(g)',
    dataIndex: 'weight',
    scopedSlots: { customRender: 'weight' }
  },
  {
    width: 120,
    align: 'center',
    title: '件数',
    dataIndex: 'number',
    scopedSlots: { customRender: 'number' }
  }
]
const statisticColums = [
  {
    align: 'center',
    title: '部门',
    dataIndex: 'department'
  },
  {
    align: 'center',
    title: '半成品',
    dataIndex: 'bcp_weight'
  }, {
    align: 'center',
    title: '成品',
    dataIndex: 'cp_weight'
  }, {
    align: 'center',
    title: '废品',
    dataIndex: 'fp_weight'
  }, {
    align: 'center',
    title: '退货',
    dataIndex: 'th_weight'
  }, {
    align: 'center',
    title: '损耗',
    dataIndex: 'lost_weight'
  }
]

export default {
  name: 'SendTimeLine',
  data () {
    return {
      data: [],
      ending: '待完成...',
      columns,
      statisticColums,
      statisticData: []
    }
  },
  props: {
    'details': {
      default: false,
      type: [Boolean]
    },
    'detailsId': {
      default: 0,
      type: [Number, String]
    }
  },
  watch: {
    details (open) {
      if (open) {
        this.getSendById(this.detailsId)
        this.getStatisticById(this.detailsId)
      }
    }
  },
  methods: {
    moment,
    onClose () {
      this.$emit('update:details', false)
    },
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
