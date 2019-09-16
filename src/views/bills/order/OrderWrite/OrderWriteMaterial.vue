<template>
  <div>
    <a-card>
      <router-link :to="{ name: 'BillsOrderList' }">
        <a-button>返回</a-button>
      </router-link>
      <a-form :form="form">
        <a-row :gutter="8">
          <a-col :xs="8">
            <a-form-item label="单据类型" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-select
                v-decorator="[
                  'orderType',
                  {rules: [{ required: true, message: '请选择单据类型' }]}
                ]"
                :options="options"
                placeholder="请选择单据类型"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="8">
            <a-form-item :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label="日期">
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
          <a-col :xs="8">
            <a-form-item label="公司编码" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-input
                @blur="findCompanyName($event)"
                placeholder="请输入公司编码"
                v-decorator="[
                  'companyCode',
                  {rules: [{ required: true, message: '请输入公司编码' }]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :xs="8">
            <a-form-item label="公司名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-select
                v-decorator="[
                  'companyName',
                  {rules: [{ required: true, message: '请输入公司名称' }]}
                ]"
                placeholder="请输入公司名称"
              >
                <a-select-option
                  v-for="item in companys"
                  :value="item.name"
                  :key="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="8">
            <a-form-item label="出入库" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'type',
                  {rules: [{ required: true, message: '请输入ID' }]}
                ]"
              >
                <a-radio-button value="入库">入库</a-radio-button>
                <a-radio-button value="出库">出库</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :xs="8">
            <a-form-item label="总价" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-input
                :disabled="true"
                v-decorator="[
                  'totalPay',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="8">
            <a-form-item label="总重量(g)" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-input
                :disabled="true"
                v-decorator="[
                  'totalWeight',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :loading="loading">
        <template
          v-for="(col, i) in ['orderId', 'productName', 'weight', 'unitPrice', 'pay', 'remarks']"
          :slot="col"
          slot-scope="text, record">
          <a-select
            :key="col"
            style="width: 100px"
            v-if="record.editable && col == 'productName'"
            :value="text"
            @change="e => handleChange(e, record.key, col)">
            <a-select-option value="板料">板料</a-select-option>
          </a-select>
          <a-input
            :key="col"
            v-else-if="record.editable && col !== 'productName'"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"/>
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
        <a-button v-if="!$route.query.id" @click="handleSubmit" type="primary" style="margin-left: 8px;">提交</a-button>
        <a-button @click="reset" type="primary" style="margin-left: 8px;">重置</a-button>
        <a-button v-if="idNo" @click="downloadExl" type="primary" style="margin-left: 8px;">下载</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import { getCompanyList } from '@/api/manage'
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
    title: '合计',
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
export default {
  data () {
    return {
      idNo: '',
      priceList: [],
      companys: [],
      columns,
      options: [],
      orderType: [],
      dateFormat: 'YYYY/MM/DD',
      loading: false,
      data: []
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    getCompanyList().then(res => { if (res.status === 'success') { this.companys = res.result } })
    this.$http.get('/api/list').then(res => {
      const gg = []
      res.order.map(val => {
        gg.push({ value: val, label: val })
      })
      this.options = [
        {
          value: 'material',
          label: '物料出入'
        }
      ]
    })
    if (this.$route.query.id) {
      this.$http.get(`/api/order?id=${this.$route.query.id}`).then(res => {
        this.data = JSON.parse(res.data[0].info)
        this.idNo = res.data[0].key + 1000000
        this.form.setFieldsValue({
          date: moment(res.data[0].timestamp),
          totalPay: res.data[0].total_cost,
          totalWeight: res.data[0].total_weight,
          companyName: res.data[0].custom_name,
          companyCode: res.data[0].custom_code,
          orderType: [res.data[0].custom_type, res.data[0].order_type],
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
      const Data = []
      this.data.map((val) => {
        Data.push({
          customer: this.form.getFieldValue('companyName'),
          type: val.productName,
          weight: val.weight,
          unitPrice: val.unitPrice,
          pay: val.pay,
          remarks: val.remarks
        })
      })
      const keyMap = ['customer', 'type', 'weight', 'unitPrice', 'pay', 'remarks']
      var head = {
        'A1': { 'v': '鸿泰黄金珠宝有限公司' },
        'C2': { 'v': `${this.form.getFieldValue('orderType')[1]}` },
        'E2': { 'v': '单据' },
        'A4': { 'v': '单号：' },
        'B4': { 'v': `${this.idNo}` },
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
        'C16': { 'v': '合计' },
        'D16': { 'v': `${this.form.getFieldValue('totalWeight')}g` },
        'A17': { 'v': '交货人：' },
        'B17': { 'v': '收货人：' },
        'D17': { 'v': '制单：' },
        'E17': { 'v': '翁静霞' },
        'G17': { 'v': `制表时间：${moment().format('YYYY-MM-DD HH:mm:ss')}` },
        '!merges':
          [
            // 第一行
            {
              's': { 'c': 0, 'r': 0 },
              'e': { 'c': 6, 'r': 0 }
            },
            // 单据类型
            {
              's': { 'c': 2, 'r': 1 },
              'e': { 'c': 3, 'r': 1 }
            }
          ]
      }
      var data = xlsxUtils.format2Sheet(Data, 0, 5, keyMap)
      for (var k in head) data[k] = head[k]
      var wb = xlsxUtils.format2WB(data, undefined, undefined, 'A1:G17')
      saveAs(xlsxUtils.format2Blob(wb), '这里是下载的文件名.xlsx')
    },
    findCompanyName (e) {
      if (!e.target.value) {
        return
      }
      this.$http.get(`/api/company?code=${e.target.value}`).then(res => {
        if (res.status === 'success') {
          if (res.result.length > 0) {
            this.form.setFieldsValue({
              companyName: res.result[0].name
            })
          } else {
            this.$message.error('未查到此条用户编码')
          }
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
          this.$http.post('/api/warehouse/material', values).then(res => {
            if (res.status === 'success') {
              this.$message.info('新增成功！')
              this.idNo = res.id + 2000000
            }
          })
        }
      })
    },
    reset () {
      this.form.resetFields()
      this.data = []
    },
    newMember () {
      // if (this.priceList.length === 0) {
      //   this.$message.warning('请先选择相应公司')
      //   return
      // }
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
        remarks: '',
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
      this.data.map(value => {
        totalPay += parseFloat(value.pay)
        totalWeight += parseFloat(value.weight)
      })
      this.form.setFieldsValue({
        totalPay: totalPay.toFixed(2),
        totalWeight: totalWeight.toFixed(2)
      })
      this.loading = true
      const { key, productName, weight } = record
      if (!productName) {
        this.loading = false
        this.$message.warning('请填写产品名称！')
        return
      }
      if (!weight) {
        this.loading = false
        this.$message.warning('请填写重量！')
        return
      }
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
      target.isNew = false
      this.loading = false
    },
    toggle (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancel (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (column === 'weight') {
        if (target.unitPrice) {
          const payNum = parseFloat(value) * parseFloat(target.unitPrice)
          if (!isNaN(payNum)) {
            target['pay'] = payNum.toFixed(2)
          } else {
            target['pay'] = 0.0
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
