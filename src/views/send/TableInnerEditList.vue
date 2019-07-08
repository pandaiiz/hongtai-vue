<template>
  <a-card :bordered="false">
    <a-row :span="24">
      <a-range-picker @change="onChange"/>
      <a-select defaultValue="lucy" style="width: 120px" v-model="queryParam.department">
        <a-select-option v-for="item in listData.department" :key="item" :value="item">{{ item }}</a-select-option>
      </a-select>
      <a-button type="primary" @click="queryData" style="margin-bottom: 8px;">
        <a-icon type="search" /> 查询
      </a-button>
      <a-button type="primary" @click="showDrawer" style="margin-bottom: 8px;">
        <a-icon type="plus" /> 新增
      </a-button>
    </a-row>
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
      <a-form :form="form" layout="vertical" hideRequiredMark @submit="handleSubmit">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="ID">
              <a-input
                placeholder="请输入ID"
                v-decorator="[
                  'id', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入ID' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="件数">
              <a-input
                placeholder="请输入件数"
                v-decorator="[
                  'number', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入件数' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="重量">
              <a-input-search
                v-decorator="[
                  'weight', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请读取重量' }]}
                ]"
                placeholder="请读取重量"
                size="default">
                <a-button slot="enterButton">读称</a-button>
              </a-input-search>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注">
              <a-input
                v-decorator="[
                  'remarks'
                ]"
                placeholder="请输入备注"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="部门">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'department'
                ]">
                <a-radio-button v-for="item in listData.department" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="类别">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'category'
                ]">
                <a-radio-button v-for="item in listData.category" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="成色">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'quality'
                ]">
                <a-radio-button v-for="item in listData.quality" :key="item.name" :value="item.name">{{ item.name }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="产品">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'product'
                ]">
                <a-radio-button v-for="item in listData.product" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="类型">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'type',
                  {rules: [{ required: true, message: '请选择发货类型' }]}
                ]">
                <a-radio-button value="send">发货</a-radio-button>
                <a-radio-button value="receive">收货</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
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
          <!-- <a-button
            :style="{marginRight: '8px'}"
            @click="onClose">
            补录
          </a-button> -->
          <a-button
            :style="{marginRight: '8px'}"
            @click="clearSubmit">
            重置
          </a-button>
          <a-button :style="{marginRight: '8px'}" @click="onClose" type="primary">
            关闭
          </a-button>
          <a-button html-type="submit" type="primary">提交</a-button>
        </div>
      </a-form>
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
      submitParam: {},
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
      selectedRows: []
    }
  },
  created () {
    this.loadList()
  },
  methods: {
    clearSubmit () {
      this.form.resetFields()
    },
    queryData () {
      getDataList(this.queryParam)
        .then(res => {
          res.result.data.map((val) => {
            val['editable'] = false
          })
          return res.result
        })
    },
    onChange (date, dateString) {
      this.queryParam.date = {
        start: dateString[0],
        end: dateString[1]
      }
    },
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
    submitList () {
      console.log(this.submitParam)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          this.$http.post('/machining', values).then(res => {
            if (res.status === 'success') {
              this.$message.info('新增成功！')
              this.$refs.table.refresh()
            }
          })
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
        content: `真的要删除此条信息吗?`,
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
