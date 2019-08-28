<template>
  <div>
    <a-card :bordered="false">
      <a-row :span="24">
        <a-col :span="24">
          <a-range-picker
            @change="queryData"
            v-model="queryParam.date"
            :format="dateFormat"
          />
          <send-drawer :fillData.sync="fillData" :visible.sync="visible" :balancePort="balancePort" @refresh="refreshTable"></send-drawer>
          <a-select style="margin-left: 8px" defaultValue="port1" :value="balancePort" @change="setBalancePort">
            <a-select-option value="port1">1号秤</a-select-option>
            <a-select-option value="port2">2号秤</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <br />
      <a-table
        size="middle"
        :scroll="{ x: true }"
        :columns="columns"
        :pagination="false"
        :dataSource="data">
        <template slot="id" slot-scope="text">
          <!-- <router-link :to="{ name:'SendTimeline', query: { id: text } }"> -->
          <!-- {{ text }} -->
          <!-- </router-link> -->
          <a @click="changeView(text)">
            {{ text }}
          </a>
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a class="fill" @click="() => fill(record)">填充</a>
              <a-divider type="vertical" />
              <a class="delete" @click="() => del(record)">删除</a>
            </span>
          </div>
        </template>
      </a-table>
    </a-card>
    <send-time-line :details.sync="details" :detailsId="detailsId"></send-time-line>
  </div>
</template>

<script>
import { getDataList, getInfoList } from '@/api/manage'
import moment from 'moment'
import SendDrawer from './SendDrawer'
import SendTimeLine from './SendTimeline'

export default {
  components: {
    SendDrawer,
    SendTimeLine
  },
  data () {
    return {
      detailsId: '',
      details: false,
      visible: false,
      dateFormat: 'YYYY/MM/DD',
      fillData: {},
      queryParam: {
        date: [moment(), moment()]
      },
      balancePort: '',
      // 表头
      columns: [],
      data: []
    }
  },
  created () {
    const port = window.localStorage.getItem('port')
    this.balancePort = port
    getDataList(this.queryParam).then(res => { this.data = res.data })
    this.initHeaderFilter()
  },
  methods: {
    moment,
    initHeaderFilter () {
      const [departmentFilters, categoryFilters, qualityFilters, productFilters] = [[], [], [], []]
      getInfoList().then(res => {
        res.department.map((val) => { departmentFilters.push({ text: val, value: val }) })
        res.category.map((val) => { categoryFilters.push({ text: val, value: val }) })
        res.quality.map((val) => { qualityFilters.push({ text: val.name, value: val.name }) })
        res.product.map((val) => { productFilters.push({ text: val, value: val }) })
      }).then(() => {
        this.columns = [
          {
            align: 'center',
            title: 'ID',
            dataIndex: 'id',
            scopedSlots: { customRender: 'id' },
            sorter: (a, b) => a.id - b.id
          },
          {
            align: 'center',
            title: '部门',
            dataIndex: 'department',
            scopedSlots: { customRender: 'department' },
            filters: departmentFilters,
            onFilter: (value, record) => record.department.indexOf(value) === 0
          },
          {
            align: 'center',
            title: '类别',
            dataIndex: 'category',
            scopedSlots: { customRender: 'category' },
            filters: categoryFilters,
            onFilter: (value, record) => record.category.indexOf(value) === 0
          },
          {
            align: 'center',
            title: '类型',
            dataIndex: 'type',
            customRender: (type) => type === 'send' ? <div>发货</div> : <div>收货</div>,
            filters: [{
              text: '发货',
              value: 'send'
            }, {
              text: '收货',
              value: 'receive'
            }],
            onFilter: (value, record) => record.type.indexOf(value) === 0
          },
          {
            align: 'center',
            title: '成色',
            dataIndex: 'quality',
            scopedSlots: { customRender: 'quality' },
            filters: qualityFilters,
            onFilter: (value, record) => record.quality.indexOf(value) === 0
          },
          {
            align: 'center',
            title: '产品',
            dataIndex: 'product',
            scopedSlots: { customRender: 'product' },
            filters: productFilters,
            onFilter: (value, record) => record.product.indexOf(value) === 0
          },
          {
            align: 'center',
            title: '重量(g)',
            dataIndex: 'weight',
            scopedSlots: { customRender: 'weight' },
            sorter: (a, b) => a.weight - b.weight
          },
          {
            width: 'auto',
            align: 'center',
            title: '件数',
            dataIndex: 'number',
            scopedSlots: { customRender: 'number' },
            sorter: (a, b) => a.number - b.number
          },
          {
            align: 'center',
            title: '备注',
            dataIndex: 'remarks',
            scopedSlots: { customRender: 'remarks' }
          },
          {
            width: '50px',
            align: 'center',
            title: '时间',
            dataIndex: 'timestamp',
            customRender: (time) => { return <div class="table-time">{moment(time).format('MM-DD HH:mm')}</div> },
            sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix()
          },
          {
            width: '100px',
            align: 'center',
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ]
      })
    },
    queryData () {
      getDataList(this.queryParam).then(res => { this.data = res.data })
    },
    changeView (s) {
      this.detailsId = s
      this.details = true
    },
    refreshTable (s) {
      getDataList(this.queryParam).then(res => { this.data = res.data })
    },
    setBalancePort (port) {
      this.balancePort = port
      window.localStorage.setItem('port', port)
    },
    fill (row) {
      this.visible = true
      this.fillData = row
    },
    del (row) {
      const $this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除此条信息吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          $this.$http.delete(`/api/machining?key=${row.key}`).then(res => {
            if (res.status === 'success') {
              $this.$message.info('删除成功！')
              getDataList($this.queryParam).then(res => { $this.data = res.data })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .table-time {
    font-size: 12px;
  }
  .ant-table th, td {
    white-space: nowrap;
  }
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
