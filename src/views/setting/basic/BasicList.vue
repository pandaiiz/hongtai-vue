<template>
  <a-card>
    <a-table :columns="columns" :dataSource="settings" :rowKey="(record) => record._id" :pagination="false">
      <span slot="action" slot-scope="text, record">
        <a @click="() => $router.push({ name: 'BasicEdit', query: { id: record._id } })">编辑</a>
      </span>
    </a-table>
  </a-card>
</template>
<script>
const columns = [{
  title: '选项',
  key: 'title',
  dataIndex: 'title',
  align: 'center'
},
{
  title: '描述',
  key: 'description',
  dataIndex: 'description',
  align: 'center'
},
{
  title: '操作',
  key: 'action',
  scopedSlots: { customRender: 'action' },
  width: 100,
  fixed: 'right',
  align: 'center'
}]

export default {
  data () {
    return {
      settings: [],
      columns
    }
  },
  created () {
    this.initSettings()
  },
  methods: {
    initSettings () {
      this.$http.get('/admin/api/rest/settings').then(res => { this.settings = res })
    }
  }
}
</script>
