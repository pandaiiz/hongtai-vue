<template>
  <a-card :bordered="false">
    <a-row :span="24">
      <a-col :span="24">
        <a-range-picker
          v-model="queryParam.date"
          :format="dateFormat"
        />
        <a-select defaultValue="lucy" style="width: 120px;margin-left: 8px" v-model="queryParam.department">
          <a-select-option v-for="item in listData.department" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
        <a-button style="margin-left: 8px" type="danger" @click="() => queryParam = {}">
          <a-icon type="redo" />重置
        </a-button>
        <a-button style="margin-left: 8px" type="default" @click="$refs.table.refresh(true)">
          <a-icon type="search" /> 查询
        </a-button>
        <a-button style="margin-left: 8px" type="primary" @click="showDrawer">
          <a-icon type="plus" /> 新增
        </a-button>
        <a-select style="margin-left: 8px" defaultValue="port1" :value="balancePort" @change="setBalance">
          <a-select-option value="port1">1号秤</a-select-option>
          <a-select-option value="port2">2号秤</a-select-option>
        </a-select>
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
            <!-- <a class="edit" @click="() => edit(record)">修改</a>
            <a-divider type="vertical" /> -->
            <a class="fill" @click="() => fill(record)">填充</a>
            <a-divider type="vertical" />
            <a class="delete" @click="() => del(record)">删除</a>
          </span>
        </div>
      </template>
    </s-table>

    <a-drawer
      title="新建收发"
      :width="900"
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
              <a-input
                v-decorator="[
                  'weight', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请读取重量' }]}
                ]"
                placeholder="请读取重量"
                size="default">
                <a-icon slot="addonAfter" type="setting" @click="readWeight"/>
              </a-input>
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
                  'department',
                  {rules: [{ required: true, message: '请选择部门' }]}
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
                  'category',
                  {rules: [{ required: true, message: '请选择类别' }]}
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
                  'quality',
                  {rules: [{ required: true, message: '请选择成色' }]}
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
                  'product',
                  {rules: [{ required: true, message: '请选择产品' }]}
                ]">
                <a-radio-button v-for="item in listData.product" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
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
          <a-col :span="12" v-if="supplementDate">
            <a-form-item label="补录日期">
              <a-date-picker
                v-decorator="[
                  'supplementDate'
                ]"/>
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
          <a-button
            :style="{marginRight: '8px'}"
            @click="supplementData">
            补录
          </a-button>
          <a-button :style="{marginRight: '8px'}" @click="clearSubmit" type="danger">
            重置
          </a-button>
          <a-button :style="{marginRight: '8px'}" @click="onClose" type="default">
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
      dateFormat: 'YYYY/MM/DD',
      visible: false,
      supplementDate: false,
      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {
        date: [moment(), moment()]
      },
      submitParam: {},
      balancePort: '',
      weight: '',
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
        console.log(Object.assign(parameter, this.queryParam))
        return getDataList(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(res)
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
    const port = window.localStorage.getItem('port')
    this.balancePort = port
    getInfoList()
      .then(res => {
        this.listData = res
      })
  },
  methods: {
    moment,
    supplementData () {
      this.supplementDate = true
    },
    setBalance (port) {
      this.balancePort = port
      window.localStorage.setItem('port', port)
    },
    readWeight () {
      this.form.setFieldsValue({
        weight: '读取中...'
      })
      this.$http.get(`/collecter/weight/${this.balancePort}`).then(res => {
        if (res.state === 'error') {
          setTimeout(() => {
            this.readWeight()
          }, 1000)
        } else {
          this.form.setFieldsValue({
            weight: res.weight
          })
        }
      })
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
      this.supplementDate = false
    },
    onChange (date, dateString) {
      this.queryParam.date = {
        start: dateString[0],
        end: dateString[1]
      }
    },
    showDrawer () {
      this.visible = true
      setTimeout(() => {
        this.form.setFieldsValue({
          id: 9999
        })
      }, 0)
    },
    onClose () {
      this.visible = false
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!values.remarks) {
          values.remarks = ''
        }
        if (!err) {
          this.$http.post('/api/machining', values).then(res => {
            if (res.status === 'success') {
              this.$message.info('新增成功！')
              this.visible = false
              this.form.resetFields()
              this.$refs.table.refresh()
            }
          })
        }
      })
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
    edit (row) {
      row.editable = true
      // row = Object.assign({}, row)
    },
    // eslint-disable-next-line
    del (row) {
      const $this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除此条信息吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          $this.$http.delete(`/api/machining?key=${row.key}`).then(res => {
            if (res.status === 'success') {
              $this.$message.info('删除成功！')
              $this.$refs.table.refresh()
            }
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    save (row) {
      row.editable = false
      this.$http.put('/api/machining', row).then(res => {
        console.log(res)
        if (res.status === 'success') {
          this.$message.info('修改成功！')
          // this.visible = false
          // this.form.resetFields()
          // this.$refs.table.refresh()
        }
      })
    },
    cancel (row) {
      row.editable = false
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
