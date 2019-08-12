<template>
  <a-card :bordered="false">
    <a-row :span="24">
      <a-col :span="24">
        <a-range-picker
          v-model="queryParam.date"
          :format="dateFormat"
        />
        <a-select style="width: 120px;margin-left: 8px" v-model="queryParam.company">
          <a-select-option v-for="(item, key) in listData" :key="key + '-label'" :value="item.name">{{ item.name }}</a-select-option>
        </a-select>
        <a-button style="margin-left: 8px" type="danger" @click="() => queryParam = {}">
          <a-icon type="redo" />重置
        </a-button>
        <a-button style="margin-left: 8px" type="default" @click="$refs.table.refresh(true)">
          <a-icon type="search" /> 查询
        </a-button>
        <a-button style="margin-left: 8px" type="primary" @click="openOrderInput()">
          <a-icon type="plus" /> 新增
        </a-button>
      </a-col>
    </a-row>
    <br />
    <s-table
      ref="table"
      size="middle"
      :scroll="{ x : true }"
      :columns="columns"
      :data="loadData">
      <template v-for="(col, index) in columns" :slot="col.dataIndex" slot-scope="text, record">
        <div :key="index" v-if="col.scopedSlots">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col, record)"
          />
          <template v-else>{{ text }}</template>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record)">保存</a>
            <a-divider type="vertical" />
            <a-popconfirm title="真的放弃编辑吗?" @confirm="() => cancel(record)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a class="edit" @click="() => openOrderInput(record)">详情</a>
            <!-- <a class="fill" @click="() => edit(record)">编辑</a> -->
          </span>
        </div>
      </template>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDataList, getOrderList } from '@/api/manage'
import moment from 'moment'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      dateFormat: 'YYYY/MM/DD',
      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {
        company: '',
        date: [moment(), moment()]
      },
      submitParam: {},
      weight: '',
      form: this.$form.createForm(this),
      listData: {},
      // 表头
      columns: [
        {
          align: 'center',
          title: '单号',
          dataIndex: 'key',
          customRender: (key) => parseInt(key) + 1000000
        },
        {
          align: 'center',
          title: '类型',
          dataIndex: 'type',
          customRender: (type) => type === 'out' ? <div>出库</div> : <div>入库</div>
        },
        {
          align: 'center',
          title: '客户',
          dataIndex: 'custom_name',
          scopedSlots: { customRender: 'custom_name' }
        },
        {
          align: 'center',
          title: '总价(元)',
          dataIndex: 'total_cost',
          scopedSlots: { customRender: 'total_cost' }
        },
        {
          align: 'center',
          title: '总质量(g)',
          dataIndex: 'total_weight',
          scopedSlots: { customRender: 'total_weight' }
        },
        {
          width: '120px',
          align: 'center',
          title: '日期',
          dataIndex: 'timestamp',
          fixed: 'right',
          customRender: (time) => { return <div>{moment(time).format('YYYY-MM-DD')}</div> }
        },
        {
          width: '100px',
          align: 'center',
          table: '操作',
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getOrderList(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.result.data.map((val) => {
              val['editable'] = false
            })
            return res.result
          })
      }
    }
  },
  created () {
    this.$http.get('/api/company').then(res => {
      if (res.status === 'success') {
        this.listData = res.data
      }
    })
  },
  methods: {
    moment,
    openOrderInput (record) {
      if (record) {
        this.$router.push({ path: '/send/in-and-out', query: { id: record.key } })
        return
      }
      this.$router.push({ path: '/send/in-and-out' })
    },
    getData (parameter) {
      return getDataList(Object.assign(parameter, this.queryParam))
        .then(res => {
          res.result.data.map((val) => {
            val['editable'] = false
          })
          return res.result
        })
    },
    clearSubmit () {
      this.form.resetFields()
    },
    onChange (date, dateString) {
      this.queryParam.date = {
        start: dateString[0],
        end: dateString[1]
      }
    },
    handleChange (value, key, column, record) {
      record[column.dataIndex] = value
    },
    fill (row) {
      this.visible = true
      setTimeout(() => {
        this.form.setFieldsValue({
          id: row.id,
          number: row.number,
          weight: row.weight,
          remarks: row.remarks,
          department: row.department,
          category: row.category,
          quality: row.quality,
          product: row.product,
          type: row.type
        })
      }, 0)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style lang="less" scoped>
  .search {
    margin-bottom: 54px;
  }

  .fold {
    width: calc(100% - 216px);
    display: inline-block
  }

  .operator {
    margin-bottom: 18px;
  }

  .ant-table .ant-table-row td > div, .ant-table .ant-table-row td {
    white-space: nowrap;
  }

  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
