<template>
  <a-card :bordered="false">
    <a-row :span="24">
      <a-col :span="24">
        <a-range-picker
          v-model="queryParam.date"
          :format="dateFormat"
          @change="changeDatePicker"
        />
        <a-select style="width: 120px;margin-left: 8px" :value="queryParam.store" @change="changeSelect">
          <a-select-option v-for="(item, key) in listData.store" :key="key" :value="item">{{ item }}</a-select-option>
        </a-select>
        <a-button style="margin-left: 8px" type="danger" @click="() => queryParam = {}">
          <a-icon type="redo" />重置
        </a-button>
        <router-link :to="{ name: 'ReportWarehouse' }">
          <a-button style="margin-left: 8px">返回</a-button>
        </router-link>
      </a-col>
    </a-row>
    <br />
    <s-table
      ref="table"
      size="middle"
      :scroll="{ x : true }"
      :columns="columns"
      :data="loadData">
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getStoreData, getInfoList } from '@/api/manage'
import moment from 'moment'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      dateFormat: 'YYYY/MM/DD',
      queryParam: {
        date: [moment(), moment()],
        store: ''
      },
      form: this.$form.createForm(this),
      listData: {},
      // 表头
      columns: [
        {
          align: 'center',
          title: 'ID',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
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
          // customRender: (text) => text + ' 次'
        },
        {
          align: 'center',
          title: '类型',
          dataIndex: 'type',
          customRender: (type) => type === 'send' ? <div>发货</div> : <div>收货</div>
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
        },
        {
          align: 'center',
          title: '备注',
          dataIndex: 'remarks',
          scopedSlots: { customRender: 'remarks' }
        },
        {
          width: '120px',
          align: 'center',
          title: '时间',
          dataIndex: 'timestamp',
          fixed: 'right',
          customRender: (time) => { return <div>{moment(time).format('YYYY-MM-DD HH:mm:ss')}</div> }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getStoreData(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
      selectedRows: []
    }
  },
  created () {
    if (this.$route.query) {
      this.queryParam.store = this.$route.query.store
    }
    getInfoList()
      .then(res => {
        this.listData = res
      })
  },
  methods: {
    moment,
    changeDatePicker () {
      this.$refs.table.refresh(true)
    },
    changeSelect (target) {
      this.queryParam.store = target
      this.$refs.table.refresh(true)
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
