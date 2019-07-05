<template>
  <a-card :bordered="false">
    <!-- <div class="table-page-search-wrapper">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          :md="24"
          :sm="24"
          v-for="(list, key) in listData"
          :key="key"
          :label="key">
          <a-radio-group v-if="key === 'quality'" buttonStyle="solid" v-model="queryParam[key]">
            <a-radio-button v-for="(item, index) in list" :key="index" :value="item.name">{{ item.name }}</a-radio-button>
          </a-radio-group>
          <a-radio-group v-else buttonStyle="solid" v-model="queryParam[key]">
            <a-radio-button v-for="(item, index) in list" :key="index" :value="item">{{ item }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button @click="submitTest" htmlType="submit" type="primary">提交</a-button>
          <a-button style="margin-left: 8px">保存</a-button>
        </a-form-item>
      </a-form>
    </div> -->
    <!-- <a-button @click="submitTest" type="primary">提22交</a-button> -->
    <a-button type="primary" @click="showDrawer" style="margin-bottom: 8px;">
      <a-icon type="plus" /> 新增
    </a-button>

    <div class="table-operator">
      <!-- <a-button type="primary" icon="plus">新建</a-button> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <s-table
      ref="table"
      size="middle"
      :scroll="{ x : true }"
      :columns="columns"
      :data="loadData">
      <template v-for="(col, index) in columns" v-if="col.scopedSlots" :slot="col.dataIndex" slot-scope="text, record">
        <div :key="index">
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
            <a class="edit" @click="() => edit(record)">修改</a>
            <a-divider type="vertical" />
            <a class="delete" @click="() => del(record)">删除</a>
          </span>
        </div>
      </template>
    </s-table>

    <a-drawer
      title="新建收发"
      :width="720"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="备注">
              <a-input
                v-decorator="['remarks', {
                  rules: [{ required: true, message: '请输入备注' }]
                }]"
                placeholder="请输入备注"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="ID">
              <a-input
                v-decorator="['id', {
                  rules: [{ required: true, message: '请输入ID' }]
                }]"
                placeholder="请输入ID"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="重量">
              <!-- <a-input
                v-decorator="['weight', {
                  rules: [{ required: true, message: '请输入重量' }]
                }]"
                placeholder="请输入重量"
              /> -->
              <a-input-search placeholder="请读取重量" size="default">
                <a-button slot="enterButton">读称</a-button>
              </a-input-search>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="件数">
              <a-input
                v-decorator="['number', {
                  rules: [{ required: true, message: '请输入件数' }]
                }]"
                placeholder="请输入件数"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="部门">
              <a-radio-group buttonStyle="solid" v-model="queryParam.department">
                <a-radio-button v-for="item in listData.department" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="类别">
              <a-radio-group buttonStyle="solid" v-model="queryParam.category">
                <a-radio-button v-for="item in listData.category" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="成色">
              <a-radio-group buttonStyle="solid" v-model="queryParam.quality">
                <a-radio-button v-for="item in listData.quality" :key="item.name" :value="item.name">{{ item.name }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="产品">
              <a-radio-group buttonStyle="solid" v-model="queryParam.product">
                <a-radio-button v-for="item in listData.product" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Approver">
              <a-select
                v-decorator="['approver', {
                  rules: [{ required: true, message: 'Please choose the approver' }]
                }]"
                placeholder="Please choose the approver"
              >
                <a-select-option value="jack">Jack Ma</a-select-option>
                <a-select-option value="tom">Tom Liu</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="DateTime">
              <a-date-picker
                v-decorator="['dateTime', {
                  rules: [{ required: true, message: 'Please choose the dateTime' }]
                }]"
                style="width: 100%"
                :getPopupContainer="trigger => trigger.parentNode"
              />
            </a-form-item>
          </a-col>
        </a-row> -->
      </a-form>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button
          :style="{marginRight: '8px'}"
          @click="onClose">
          补录
        </a-button>
        <a-button
          :style="{marginRight: '8px'}"
          @click="onClose">
          重置
        </a-button>
        <a-button :style="{marginRight: '8px'}" @click="onClose" type="primary">
          收货
        </a-button>
        <a-button @click="onClose" type="primary">发货</a-button>
      </div>
    </a-drawer>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDataList, getInfoList } from '@/api/manage'
import moment from 'moment'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {},
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
        return getDataList(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.result.data.map((val) => {
              val['editable'] = false
            })
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.loadList()
  },
  methods: {
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    loadList () {
      getInfoList()
        .then(res => {
          this.listData = res
        })
    },
    submitTest () {
      console.log(this.queryParam)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },

    handleChange (value, key, column, record) {
      console.log(value, key, column)
      record[column.dataIndex] = value
    },
    edit (row) {
      console.log(row)
      row.editable = true
      // row = Object.assign({}, row)
    },
    // eslint-disable-next-line
    del (row) {
      console.log(row)
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${row.no} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    save (row) {
      row.editable = false
    },
    cancel (row) {
      row.editable = false
    },
    onSelectChange (selectedRowKeys, selectedRows) {
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
