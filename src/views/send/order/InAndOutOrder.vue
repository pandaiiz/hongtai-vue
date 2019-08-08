<template>
  <div>
    <!-- table -->
    <a-card>
      <a-form :form="form">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              label="日期">
              <a-date-picker
                :format="dateFormat"
                v-decorator="[
                  'date', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入ID' }]}
                ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="客户编码"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-input
                @blur="findCompanyName($event)"
                placeholder="请输入客户编码"
                v-decorator="[
                  'customCode', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入客户编码' }]}
                ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="出入库"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'type', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入ID' }]}
                ]">
                <a-radio-button value="in">入库</a-radio-button>
                <a-radio-button value="out">出库</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="客户类型"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'customType', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请选择客户类型' }]}
                ]">
                <a-radio-button value="supplier">供应商</a-radio-button>
                <a-radio-button value="customer">客户</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="客户名称"
              :label-col="{ span: 12 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                placeholder="请输入客户名称"
                v-decorator="[
                  'customName', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入客户请输入客户名称编码' }]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="类型"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 22 }"
            >
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'orderType', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请选择订单类型' }]}
                ]">
                <a-radio-button v-for="item in typeOption" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="总价"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-input
                :disabled="true"
                v-decorator="[
                  'totalPay', // 给表单赋值或拉取表单时，该input对应的key
                ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="总重量"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-input
                :disabled="true"
                v-decorator="[
                  'totalWeight',
                ]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :loading="memberLoading">
        <template v-for="(col, i) in ['orderId', 'productName', 'quality', 'number', 'weight', 'unitPrice', 'pay', 'remarks']" :slot="col" slot-scope="text, record">
          <a-select :key="col" style="width: 70px" v-if="record.editable && col == 'quality'" :value="text" @change="e => handleChange(e, record.key, col)">
            <a-select-option v-for="(quality, index) in qualityOption" :key="index" :value="quality.name">{{ quality.name }}</a-select-option>
          </a-select>
          <a-input
            :key="col"
            v-else-if="record.editable && col !== 'quality'"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
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
      <div style="margin-top: 16px; margin-bottom: 8px; float: right;">
        <a-button v-if="this.data.length < 6" type="dashed" @click="newMember">新增</a-button>
        <a-button @click="handleSubmit" type="primary" style="margin-left: 8px;">提交</a-button>
      </div>
      <router-link to="{ path : '/setting/customer-input' }">
        <a-button>跳转</a-button>
      </router-link>
      <a-button>导出</a-button>
    </a-card>
    <template>
      <div>
        <!-- <a-button type="primary" @click="showPrint">预览</a-button> -->
        <a-modal title="打印预览" v-model="visible" :bodyStyle="{ width: '800px' }">
          <template slot="footer">
            <a-button key="back" @click="closePrint">关闭</a-button>
            <a-button v-print="'#printMe'" type="primary" :loading="loading">
              打印
            </a-button>
          </template>
          <div id="printMe">
            <p>葫芦娃，葫芦娃</p>
            <p>一根藤上七朵花</p>
            <p>小小树藤是我家啦啦啦啦</p>
            <p>叮当当咚咚当当浇不大</p>
            <p> 叮当当咚咚当当是我家</p>
            <p> 啦啦啦啦</p>
          </div>
        </a-modal>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
// import XLSX from 'xlsx'
// import saveAs from 'file-saver'
// const data = [
//   ['11', '22', '33'],
//   ['测试1', '测试2', '测试3'],
//   ['测试1', '测试2', '测试3'],
//   ['测试1', '测试2', '测试3'],
//   ['测试1', '测试2', '测试3'],
//   ['测试1', '测试2', '测试3']
// ]
// function Workbook () {
//   if (!(this instanceof Workbook)) return new Workbook()
//   this.SheetNames = []
//   this.Sheets = {}
// }
// function sheetFromArrayOfArrays (data, opts) {
//   var ws = {}
//   var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } }
//   for (var R = 0; R !== data.length; ++R) {
//     for (var C = 0; C !== data[R].length; ++C) {
//       if (range.s.r > R) range.s.r = R
//       if (range.s.c > C) range.s.c = C
//       if (range.e.r < R) range.e.r = R
//       if (range.e.c < C) range.e.c = C
//       var cell = { v: data[R][C] }
//       if (cell.v == null) continue
//       var cellRef = XLSX.utils.encode_cell({ c: C, r: R })
//       if (typeof cell.v === 'number') cell.t = 'n'
//       else if (typeof cell.v === 'boolean') cell.t = 'b'
//       else if (cell.v instanceof Date) {
//         cell.t = 'n'
//         cell.z = XLSX.SSF._table[14]
//       } else cell.t = 's'
//       ws[cellRef] = cell
//     }
//   }
//   if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
//   return ws
// }
// const workBook = new Workbook()
// const ws = sheetFromArrayOfArrays(data)
// workBook.SheetNames.push('测试')
// workBook.Sheets['测试'] = ws
// const wbout = XLSX.write(workBook, {
//   bookType: 'xlsx',
//   bookSST: true,
//   type: 'binary'
// })
// function s2ab (s) {
//   var buf = new ArrayBuffer(s.length)
//   var view = new Uint8Array(buf)
//   for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
//   return buf
// }
// saveAs(new Blob([s2ab(wbout)], { type: '' }), 'report888.xlsx')
export default {
  data () {
    return {
      visible: false,
      typeOption: {},
      qualityOption: {},
      dateFormat: 'YYYY/MM/DD',
      loading: false,
      memberLoading: false,
      // table
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderId',
          key: 'orderId',
          align: 'center',
          scopedSlots: { customRender: 'orderId' }
        },
        {
          title: '货品名称',
          dataIndex: 'productName',
          key: 'productName',
          align: 'center',
          scopedSlots: { customRender: 'productName' }
        },
        {
          title: '成色',
          dataIndex: 'quality',
          key: 'quality',
          align: 'center',
          scopedSlots: { customRender: 'quality' }
        },
        {
          title: '数量(件)',
          dataIndex: 'number',
          key: 'number',
          align: 'center',
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '重量(g)',
          dataIndex: 'weight',
          key: 'weight',
          align: 'center',
          scopedSlots: { customRender: 'weight' }
        },
        {
          title: '单价',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          align: 'center',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          title: '合计工费',
          dataIndex: 'pay',
          key: 'pay',
          align: 'center',
          scopedSlots: { customRender: 'pay' }
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          key: 'remarks',
          align: 'center',
          scopedSlots: { customRender: 'remarks' }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      errors: []
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.$http.get('/api/list').then(res => { this.typeOption = res.order; this.qualityOption = res.quality })
    if (this.$route.query.id) {
      this.$http.get(`/api/order?id=${this.$route.query.id}`)
        .then(res => {
          this.data = JSON.parse(res.data[0].info)
          this.form.setFieldsValue({
            date: moment(res.data[0].timestamp),
            totalPay: res.data[0].total_cost,
            totalWeight: res.data[0].total_weight,
            customName: res.data[0].custom_name,
            customCode: res.data[0].custom_code,
            orderType: res.data[0].state,
            type: res.data[0].type
          })
        })
    }
  },
  mounted () {
    this.form.setFieldsValue({
      date: moment()
    })
  },
  methods: {
    findCompanyName (e) {
      this.$http.get(`/api/company?code=${e.target.value}`)
        .then(res => {
          if (res.status === 'success') {
            this.form.setFieldsValue({
              customName: res.data[0].name,
              customType: res.data[0].type
            })
          }
        })
    },
    handleOk (e) {
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 3000)
    },
    closePrint (e) {
      this.visible = false
    },
    showPrint () {
      this.visible = true
    },
    printOrder (e) {
      this.visible = false
    },
    moment,
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const dataList = []
          this.data.map((value) => {
            if (value.editable) {
              this.$message.error('请先保存条目！')
              return
            }
            dataList.push(value)
          })
          values.info = JSON.stringify(dataList)
          this.$http.post('/api/order', values).then(res => {
            console.log(res)
            if (res.status === 'success') {
              this.$message.info('新增成功！')
              this.visible = false
              this.form.resetFields()
              // this.$refs.table.refresh()
            }
          })
        }
      })
    },
    newMember () {
      const length = this.data.length
      if (length > 5) {
        this.$message.error('最多只能添加6条')
        return
      }
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        orderId: '',
        productName: '',
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow (record) {
      let totalPay = 0
      let totalWeight = 0
      this.data.map((value) => {
        totalPay += parseFloat(value.pay)
        totalWeight += parseFloat(value.weight)
      })
      this.form.setFieldsValue({
        totalPay: totalPay,
        totalWeight: totalWeight
      })
      this.memberLoading = true
      const { key, productName, quality, weight } = record
      if (!productName) {
        this.memberLoading = false
        this.$message.warning('请填写产品名称！')
        return
      }
      if (!quality) {
        this.memberLoading = false
        this.$message.warning('请填写成色！')
        return
      }
      if (!weight) {
        this.memberLoading = false
        this.$message.warning('请填写重量！')
        return
      }
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
      target.isNew = false
      this.memberLoading = false
      // 模拟网络请求、卡顿 800ms
      // new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve({ loop: false })
      //   }, 800)
      // }).then(() => {
      //   const target = this.data.filter(item => item.key === key)[0]
      //   target.editable = false
      //   target.isNew = false
      //   this.memberLoading = false
      // })
    },
    toggle (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    getRowByKey (key, newData) {
      const data = this.data
      return (newData || data).filter(item => item.key === key)[0]
    },
    cancel (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    handleChange (value, key, column) {
      console.log(value, key, column)
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (column === 'weight') {
        if (target.unitPrice) {
          const payNum = parseFloat(value) * parseFloat(target.unitPrice)
          if (!isNaN(payNum)) {
            target['pay'] = payNum.toFixed(2)
          } else {
            target['pay'] = 0.00
          }
        }
      }
      if (column === 'unitPrice') {
        if (target.weight) {
          const payNum = parseFloat(value) * parseFloat(target.weight)
          if (!isNaN(payNum)) {
            target['pay'] = payNum.toFixed(2)
          } else {
            target['pay'] = 0.00
          }
        }
      }
      if (target) {
        target[column] = value
        this.data = newData
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
  .ant-table-tbody > tr > td > span {
    white-space: nowrap;
  }
</style>
