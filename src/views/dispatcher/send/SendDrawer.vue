<template>
  <span>
    <a-button @click="showDrawer">
      <a-icon type="down"/>统计
    </a-button>
    <a-drawer
      title="订单统计"
      placement="bottom"
      @close="onClose"
      :visible="visible"
      height="auto"
    >
      <a-table :columns="columns" :dataSource="psMsg" :pagination="false" :rowKey="(record, key) => key">
      </a-table>
      {{ psMsg }}
    </a-drawer>
  </span>
</template>
<script>
const columns = [{
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
  key: 'th_weight'
}, {
  title: '损耗',
  key: 'lost_weight'
}]
export default {
  name: 'SendDrawer',
  data () {
    return {
      data: [],
      columns,
      visible: false
    }
  },
  props: {
    'psMsg': {
      default: () => [],
      type: [Array]
    }
  },
  methods: {
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    }
  }
}
</script>
