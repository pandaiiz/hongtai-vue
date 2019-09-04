<template>
  <a-card :bordered="false">
    此处应该有  所有的材料分别在哪些仓库，还有总仓中的所有重量，加收发室内的所有质量
  </a-card>
</template>

<script>
import { STable } from '@/components'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,

      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '唯一识别码',
          dataIndex: 'id'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '状态',
          dataIndex: 'status'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http.get('/role', {
          params: Object.assign(parameter, this.queryParam)
        }).then(res => {
          return res.result
        })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    handleEdit (record) {
      this.mdl = Object.assign({}, record)

      this.mdl.permissions.forEach(permission => {
        permission.actionsOptions = permission.actionEntitySet.map(action => {
          return { label: action.describe, value: action.action, defaultCheck: action.defaultCheck }
        })
      })

      console.log(this.mdl)
      this.visible = true
    },
    handleOk () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
