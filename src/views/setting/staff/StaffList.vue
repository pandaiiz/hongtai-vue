<template>
  <a-card>
    <a-button @click="() => $router.push({ name: 'StaffEdit' })">新增</a-button>
    <a-table :columns="columns" :dataSource="staffs" :rowKey="(record) => record._id" :pagination="false">
      <span slot="action" slot-scope="text, record">
        <a @click="() => $router.push({ name: 'StaffEdit', query: { id: record._id } })">编辑</a>
        <a-divider type="vertical"></a-divider>
        <a @click="deleteOption(record._id)">删除</a>
      </span>
    </a-table>
  </a-card>
</template>
<script>
import { getStaffList } from '@/api/staff'
const columns = [{
  title: '员工姓名',
  key: 'name',
  dataIndex: 'name',
  align: 'center'
},
{
  title: '员工编号',
  key: 'staffCode',
  dataIndex: 'staffCode',
  align: 'center'
},
{
  title: '部门',
  key: 'department',
  dataIndex: 'department',
  align: 'center'
},
{
  title: '操作',
  key: 'action',
  scopedSlots: { customRender: 'action' },
  width: 120,
  fixed: 'right',
  align: 'center'
}]

export default {
  data () {
    return {
      staffs: [],
      columns
    }
  },
  created () {
    getStaffList().then(res => { this.staffs = res })
  },
  methods: {
    deleteOption (id) {
      this.$http.delete(`/admin/api/rest/staff/${id}`).then(res => {
        if (res) {
          this.$message.success('删除成功！')
          getStaffList().then(res => { this.staffs = res })
        }
      })
    }
  }
}
</script>
