<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-table :columns="columns" :dataSource="data" :pagination="false">
      <template slot="action" slot-scope="text, record">
        <router-link :to="{ name:'Staff', query: { code: record.code } }">
          详情
        </router-link>
      </template>
    </a-table>
  </a-card>
</template>
<script>

export default {
  data () {
    return {
      data: [],
      columns: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    departmentFilter (arr) {
      const departmentArray = []
      arr.map((val) => {
        departmentArray.push(val.department)
      })
      const departmentItem = departmentArray.filter((x, index, self) => self.indexOf(x) === index)
      const departmentFilter = []
      departmentItem.map((val) => {
        departmentFilter.push({ text: val, value: val })
      })
      return departmentFilter
    },
    init () {
      this.$http.get('/api/staff').then(res => {
        const filter = this.departmentFilter(res.data)
        this.data = res.data
        this.columns = [{
          title: 'ID',
          dataIndex: 'code',
          sorter: (a, b) => +a.code - +b.code
        }, {
          title: '姓名',
          dataIndex: 'name'
        }, {
          title: '部门',
          dataIndex: 'department',
          filters: filter,
          onFilter: (value, record) => record.department.indexOf(value) === 0,
          sorter: (a, b) => a.department.length - b.department.length
        }, {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }]
      })
    }
  }
}
</script>
