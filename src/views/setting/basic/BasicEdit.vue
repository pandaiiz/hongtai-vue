<template>
  <div>
    <a-card>
      <a-table
        :columns="columns"
        :dataSource="data.options"
        :pagination="false"
        :loading="memberLoading"
      >
        <template v-for="(col, i) in editField" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.key)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button style="width: 50%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">新增</a-button>
      <a-button style="width: 50%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="save" @click="saveMember">保存</a-button>
    </a-card>
  </div>
</template>

<script>
import { getSetting, putSetting } from '@/api/setting'
export default {
  data () {
    return {
      editField: [],
      memberLoading: false,
      columns: [
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      getSetting(this.$route.query.id).then(res => {
        res.options.map((val, key) => {
          val.key = key
          val.editable = false
        })
        res.dataIndex.map(index => {
          this.editField.push(index.field)
          this.columns.unshift({
            title: index.title,
            dataIndex: index.field,
            key: index.field,
            scopedSlots: { customRender: index.field }
          })
        })
        this.data = res
      })
    },
    saveMember () {
      for (const i of this.data.options) {
        if (i.editable) {
          this.$message.error('请先保存！')
          return false
        }
      }
      putSetting(this.$route.query.id, this.data).then(res => {
        if (res.success) this.$message.success('修改成功！')
      })
    },
    newMember () {
      const length = this.data.options.length
      this.data.options.push({
        key: length === 0 ? '1' : (parseInt(this.data.options[length - 1].key) + 1).toString(),
        editable: true
      })
    },
    remove (key) {
      const newData = this.data.options.filter(item => item.key !== key)
      this.data.options = newData
    },
    saveRow (record) {
      const { key } = record
      const target = this.data.options.filter(item => item.key === key)[0]
      target.editable = false
    },
    toggle (key) {
      const target = this.data.options.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancel (key) {
      const target = this.data.options.filter(item => item.key === key)[0]
      target.editable = false
    },
    handleChange (value, key, column) {
      const newData = [...this.data.options]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data.options = newData
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
  .popover-wrapper {
    /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
      min-width: 256px;
      max-height: 290px;
      padding: 0;
      overflow: auto;
    }
  }
  .antd-pro-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;
    i {
          margin-right: 4px;
    }
  }
  .antd-pro-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background: #e6f7ff;
    }
    .antd-pro-pages-forms-style-errorIcon {
      float: left;
      margin-top: 4px;
      margin-right: 12px;
      padding-bottom: 22px;
      color: #f5222d;
    }
    .antd-pro-pages-forms-style-errorField {
      margin-top: 2px;
      color: rgba(0,0,0,.45);
      font-size: 12px;
    }
  }
</style>
