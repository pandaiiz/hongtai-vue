<template>
  <div>
    <!-- table -->
    <a-card>
      <router-link :to="{ name: 'BillsOrderList' }">
        <a-button>返回</a-button>
      </router-link>
      <a-form :form="form">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="单据类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-cascader
                v-decorator="[
                  'orderType', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请选择单据类型' }]}
                ]"
                :options="options"
                @change="orderTypeOnChange"
                placeholder="请选择单据类型"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="日期">
              <a-date-picker
                style="width: 100%"
                :format="dateFormat"
                v-decorator="[
                  'date',
                  {rules: [{ required: true, message: '请选择日期' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司编码" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input
                @blur="findCompanyName($event)"
                placeholder="请输入公司编码"
                v-decorator="[
                  'companyCode', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入公司编码' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-select
                v-decorator="[
                  'companyName', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入公司名称' }]}
                ]"
                showSearch
                placeholder="请输入公司名称"
                optionFilterProp="children"
                @change="companyNameChange"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in companys"
                  :value="item.name"
                  :key="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="总价" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input
                :disabled="true"
                v-decorator="[
                  'totalPay', // 给表单赋值或拉取表单时，该input对应的key
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="总重量(g)" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input
                :disabled="true"
                v-decorator="[
                  'totalWeight',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="折足(g)" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input
                :disabled="true"
                v-decorator="[
                  'convertWeight',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="出入库" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'type', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入ID' }]}
                ]"
              >
                <a-radio-button value="in">入库</a-radio-button>
                <a-radio-button value="out">出库</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :loading="memberLoading"
      >
        <template
          v-for="(col, i) in ['orderId', 'productName', 'quality', 'number', 'weight', 'unitPrice', 'pay', 'remarks']"
          :slot="col"
          slot-scope="text, record"
        >
          <a-select
            :key="col"
            style="width: 100px"
            v-if="record.editable && col == 'productName'"
            :value="text"
            @change="e => handleChange(e, record.key, col)"
          >
            <a-select-option
              v-for="(product, index) in priceList"
              @click="setQuality(record.key, product.quality, product.unitPrice)"
              :key="index"
              :value="`${product.quality + product.name}`"
            >{{ product.quality + product.name }}</a-select-option>
          </a-select>
          <a-input
            :key="col"
            v-else-if="record.editable && col !== 'productName'"
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
        <a-button @click="downloadExl" type="primary" style="margin-left: 8px;">下载</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import xlsxUtils from '@/utils/xlsx.utils'
import saveAs from 'file-saver'
const columns = [
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
]
var Data =
  [{
    'customer': '鸿泰', 'type': '板料', 'quality': '千足金', 'weight': '22', 'unitPrice': '2', 'pay': '999', 'remarks': '测试测试'
  }, {
    'customer': '鸿泰', 'type': '板料', 'quality': '千足金', 'weight': '22', 'unitPrice': '2', 'pay': '999', 'remarks': '测试测试'
  }, {
    'customer': '鸿泰', 'type': '板料', 'quality': '千足金', 'weight': '22', 'unitPrice': '2', 'pay': '999', 'remarks': '测试测试'
  }, {
    'customer': '鸿泰', 'type': '板料', 'quality': '千足金', 'weight': '22', 'unitPrice': '2', 'pay': '999', 'remarks': '测试测试'
  }]
var keyMap = ['customer', 'type', 'quality', 'weight', 'unitPrice', 'pay', 'remarks']// 通过设置数组让导出时可以按顺序显示

export default {
  data () {
    return {
      priceList: [],
      companys: [],
      columns,
      options: [],
      orderType: [],
      customType: '',
      qualityOption: {},
      dateFormat: 'YYYY/MM/DD',
      memberLoading: false,
      data: []
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.$http.get('/api/list').then(res => {
      this.qualityOption = res.quality
      const gg = []
      res.order.map(val => {
        gg.push({ value: val, label: val })
      })
      this.options = [
        {
          value: 'supplier',
          label: '供应商',
          children: [
            {
              value: '铜胚出入',
              label: '铜胚出入'
            },
            {
              value: '电铸出入',
              label: '电铸出入'
            },
            {
              value: '刀具出入',
              label: '刀具出入'
            }
          ]
        },
        {
          value: 'customer',
          label: '客户',
          children: [
            {
              value: '铜胚出入',
              label: '铜胚出入'
            },
            {
              value: '成品出入',
              label: '成品出入'
            }
          ]
        }
      ]
    })
    if (this.$route.query.id) {
      this.$http.get(`/api/order?id=${this.$route.query.id}`).then(res => {
        this.data = JSON.parse(res.data[0].info)
        this.form.setFieldsValue({
          date: moment(res.data[0].timestamp),
          totalPay: res.data[0].total_cost,
          totalWeight: res.data[0].total_weight,
          companyName: res.data[0].custom_name,
          companyCode: res.data[0].custom_code,
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
    downloadExl () {
      var head = {
        'A1': { 'v': '鸿泰黄金珠宝有限公司' },
        'A2': { 'v': `${this.form.getFieldValue('orderType')[1]}单据` },
        'A4': { 'v': '单号：' },
        'B4': { 'v': '88888888' },
        'F4': { 'v': '时间：' },
        'G4': { 'v': `${this.form.getFieldValue('date').format('YYYY-MM-DD')}` },
        'A5': { 'v': '客户' },
        'B5': { 'v': '款式类别' },
        'C5': { 'v': '成色' },
        'D5': { 'v': '重量' },
        'E5': { 'v': '单价' },
        'F5': { 'v': '工费' },
        'G5': { 'v': '备注' },
        'C15': { 'v': '折足' },
        'D15': { 'v': '888' },
        'C16': { 'v': '合计' },
        'D16': { 'v': '888' },
        'G17': { 'v': '制表时间：123' },
        '!merges':
          [
            // 第一行
            {
              's': { 'c': 0, 'r': 0 },
              'e': { 'c': 6, 'r': 0 }
            },
            // 单据类型
            {
              's': { 'c': 0, 'r': 1 },
              'e': { 'c': 6, 'r': 1 }
            }
          ]
      }
      var data = xlsxUtils.format2Sheet(Data, 0, 5, keyMap)
      for (var k in head) data[k] = head[k]
      var wb = xlsxUtils.format2WB(data, undefined, undefined, 'A1:G17')
      saveAs(xlsxUtils.format2Blob(wb), '这里是下载的文件名.xlsx')
    },
    setQuality (index, value, price) {
      this.data[+index - 1].quality = value
      this.data[+index - 1].unitPrice = price
    },
    companyNameChange (value) {
      const company = this.companys.find(item => item.name === value)
      this.priceList = JSON.parse(company.price_list)
      this.form.setFieldsValue({
        companyCode: company.code
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    orderTypeOnChange (value) {
      this.$http.get(`/api/company?companyType=${value[0]}&orderType=${value[1]}`).then(res => {
        if (res.status === 'success') {
          this.companys = res.data
          this.form.resetFields(['companyName', 'companyCode'])
        }
      })
    },
    findCompanyName (e) {
      if (!e.target.value) {
        return
      }
      this.$http.get(`/api/company?code=${e.target.value}`).then(res => {
        if (res.status === 'success') {
          this.$http
            .get(`/api/company?companyType=${res.data[0].company_type}&orderType=${res.data[0].order_type}`)
            .then(result => {
              if (result.status === 'success') {
                this.companys = result.data
              }
            })
          this.form.setFieldsValue({
            orderType: [res.data[0].company_type, res.data[0].order_type]
          })
          this.form.setFieldsValue({
            companyName: res.data[0].name,
            customType: res.data[0].type
          })
        }
      })
    },
    moment,
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const dataList = []
          this.data.map(value => {
            if (value.editable) {
              this.$message.error('请先保存条目！')
              return
            }
            dataList.push(value)
          })
          values.info = JSON.stringify(dataList)
          this.$http.post('/api/order', values).then(res => {
            if (res.status === 'success') {
              this.$message.info('新增成功！')
              this.form.resetFields()
            }
          })
        }
      })
    },
    newMember () {
      if (this.priceList.length === 0) {
        this.$message.warning('请先选择相应公司')
        return
      }
      const length = this.data.length
      if (length > 5) {
        this.$message.error('最多只能添加6条')
        return
      }
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        orderId: '',
        quality: '',
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
      let convertWeight = 0
      let totalPay = 0
      let totalWeight = 0
      this.data.map(value => {
        convertWeight += parseFloat(value.convert)
        totalPay += parseFloat(value.pay)
        totalWeight += parseFloat(value.weight)
      })
      this.form.setFieldsValue({
        convertWeight: convertWeight,
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
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      const percent = +this.qualityOption.find((a) => { return a.name === target.quality }).percent / 100
      if (column === 'weight') {
        if (target.unitPrice) {
          const payNum = parseFloat(value) * parseFloat(target.unitPrice)
          if (!isNaN(payNum)) {
            target['pay'] = payNum.toFixed(2)
            target['convert'] = value * percent
          } else {
            target['pay'] = 0.0
            target['convert'] = 0.0
          }
        }
      }
      if (column === 'unitPrice') {
        if (target.weight) {
          const payNum = parseFloat(value) * parseFloat(target.weight)
          if (!isNaN(payNum)) {
            target['pay'] = payNum.toFixed(2)
          } else {
            target['pay'] = 0.0
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
.card {
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
  transition: all 0.3s;

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
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
.ant-table-tbody > tr > td > span {
  white-space: nowrap;
}
</style>
