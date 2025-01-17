<template>
  <div>
    <a-card :bordered="false">
      <!-- <a-button @click="clearFilters"></a-button> -->
      <a-row :span="24">
        <a-col :span="24">
          <a-range-picker
            @change="queryData"
            v-model="queryParam.date"
            :format="dateFormat"
          />
          <add-send-order></add-send-order>
          <add-send-record :fillData.sync="fillData" :visible.sync="visible" :balancePort="balancePort" @refresh="refreshTable"></add-send-record>
          <a-select style="margin-left: 8px" defaultValue="port1" :value="balancePort" @change="setBalancePort">
            <a-select-option value="port1">1号秤</a-select-option>
            <a-select-option value="port2">2号秤</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <br />
      <a-table
        :rowClassName="setClassName"
        @change="dataFilter"
        size="middle"
        :scroll="{ x: true }"
        :columns="columns"
        :pagination="false"
        :rowKey="record => record._id"
        :dataSource="data">
        <template slot="id" slot-scope="text">
          <a @click="changeView(text)">
            {{ text }}
          </a>
        </template>
        <template slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class="custom-filter-dropdown">
          <a-input
            v-ant-ref="c => searchInput = c"
            :placeholder="`请输入要查询的值`"
            :value="selectedKeys[0]"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleSearch(selectedKeys, confirm)"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
          >查询</a-button>
          <a-button
            @click="() => handleReset(clearFilters)"
            size="small"
            style="width: 90px"
          >重置</a-button>
        </template>
        <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#108ee9' : undefined }" />
        <template slot="filterId" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class="custom-filter-dropdown">
          <a-input
            v-ant-ref="c => searchInput = c"
            :placeholder="`请输入要查询的值`"
            :value="selectedKeys[0]"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleSearch(selectedKeys, confirm)"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
          >查询</a-button>
          <a-button
            @click="() => handleReset(clearFilters)"
            size="small"
            style="width: 90px"
          >重置</a-button>
        </template>
        <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#108ee9' : undefined }" />
        <template slot="createTime" slot-scope="text">
          {{ moment(text).format('MM-DD HH:mm') }}
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
  </div>
</template>

<script>
import { getDataList, getInfoList } from '@/api/manage'
import { deleteMachining } from '@/api/send'
import moment from 'moment'

import AddSendOrder from './AddSendOrder'
import AddSendRecord from './AddSendRecord'

export default {
  components: {
    AddSendRecord,
    AddSendOrder
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
      columns: [],
      data: []
    }
  },
  created () {
    const port = window.localStorage.getItem('port')
    this.balancePort = port
    getDataList(this.queryParam).then(res => { this.data = res; console.log(res) })
    this.initHeader()
  },
  methods: {
    moment,
    setClassName (record, index) {
      let className
      if (record.state === 0) className = 'delete-row'
      return className
    },
    handleSearch (selectedKeys, confirm) {
      confirm()
    },
    handleReset (clearFilters) {
      clearFilters()
    },
    dataFilter (pagination, filters, sorter) {
      getDataList(Object.assign(this.queryParam, { filters })).then(res => { this.data = res.result })
    },
    initHeader () {
      this.columns = [
        {
          align: 'center',
          title: 'ID',
          dataIndex: 'transferId',
          scopedSlots: { customRender: 'transferId', filterDropdown: 'filterId', filterIcon: 'filterIcon' }
          // sorter: (a, b) => a.id - b.id
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
        },
        {
          align: 'center',
          title: '类型',
          dataIndex: 'type',
          customRender: (type) => type === '发货' ? <div>发货</div> : <div>收货</div>,
          filters: [{
            text: '发货',
            value: '收货'
          }, {
            text: '收货',
            value: '收货'
          }]
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
          width: 'auto',
          align: 'center',
          title: '件数',
          dataIndex: 'number',
          scopedSlots: { customRender: 'number' }
        },
        {
          align: 'center',
          title: '备注',
          dataIndex: 'remarks',
          scopedSlots: { customRender: 'remarks', filterDropdown: 'filterDropdown', filterIcon: 'filterIcon' }
        },
        {
          width: '50px',
          align: 'center',
          title: '时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
          // customRender: (time) => { return <div class="table-time">{moment(time).format('YYYY-MM-DD HH:mm')}</div> }
        },
        {
          width: '100px',
          align: 'center',
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
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
            scopedSlots: { customRender: 'id', filterDropdown: 'filterId', filterIcon: 'filterIcon' }
            // sorter: (a, b) => a.id - b.id
          },
          {
            align: 'center',
            title: '部门',
            dataIndex: 'department',
            scopedSlots: { customRender: 'department' },
            filters: departmentFilters
          },
          {
            align: 'center',
            title: '类别',
            dataIndex: 'category',
            scopedSlots: { customRender: 'category' },
            filters: categoryFilters
          },
          {
            align: 'center',
            title: '类型',
            dataIndex: 'type',
            customRender: (type) => type === '发货' ? <div>发货</div> : <div>收货</div>,
            filters: [{
              text: '发货',
              value: '收货'
            }, {
              text: '收货',
              value: '收货'
            }]
          },
          {
            align: 'center',
            title: '成色',
            dataIndex: 'quality',
            scopedSlots: { customRender: 'quality' },
            filters: qualityFilters
          },
          {
            align: 'center',
            title: '产品',
            dataIndex: 'product',
            scopedSlots: { customRender: 'product' },
            filters: productFilters
          },
          {
            align: 'center',
            title: '重量(g)',
            dataIndex: 'weight',
            scopedSlots: { customRender: 'weight' }
          },
          {
            width: 'auto',
            align: 'center',
            title: '件数',
            dataIndex: 'number',
            scopedSlots: { customRender: 'number' }
          },
          {
            align: 'center',
            title: '备注',
            dataIndex: 'remarks',
            scopedSlots: { customRender: 'remarks', filterDropdown: 'filterDropdown', filterIcon: 'filterIcon' }
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
      getDataList(this.queryParam).then(res => { this.data = res.result })
    },
    changeView (s) {
      this.detailsId = s
      this.details = true
    },
    refreshTable (s) {
      getDataList(this.queryParam).then(res => { this.data = res.result })
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
          deleteMachining({ key: row.key }).then(res => {
            if (res.state === 'success') {
              $this.$message.info('删除成功！')
              getDataList($this.queryParam).then(res => { $this.data = res.result })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
  .delete-row {
    background-color: #e0e0e0;
    text-decoration: line-through;
    cursor: not-allowed;
  }
  .delete-row > td > a {
    cursor: not-allowed;
  }
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
