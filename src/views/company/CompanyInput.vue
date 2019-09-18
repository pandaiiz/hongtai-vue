<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <router-link :to="{ name: 'CompanyList' }">
      <a-button type="primary">
        <a-icon type="left" />客户列表
      </a-button>
    </router-link>
    <a-spin tip="加载中..." :spinning="spinning">
      <a-form :form="form">
        <a-form-item
          label="编码"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            :disabled="state"
            v-decorator="[
              'code',
              {rules: [{ required: true, message: '请输入客户' }]}
            ]"
            name="name"
            placeholder="客户编码" />
        </a-form-item>
        <a-form-item
          label="名称"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入名称' }]}
            ]"
            name="name"
            placeholder="名称" />
        </a-form-item>
        <a-form-item
          label="备注"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-textarea
            rows="4"
            v-decorator="[
              'remarks',
              {initialValue: ''},
            ]" />
        </a-form-item>
        <a-form-item
          label="公司类型"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-radio-group
            v-decorator="[
              'companyType',
              {rules: [{ required: true, message: '请选择公司类型' }], initialValue: 'customer'}
            ]"
            buttonStyle="solid">
            <a-radio-button value="customer">客户</a-radio-button>
            <a-radio-button value="supplier">供应商</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>

      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :loading="memberLoading">
        <template v-for="(col, i) in ['quality', 'name', 'unitPrice', 'remarks']" :slot="col" slot-scope="text, record">
          <a-select :key="col" style="width: 100px" v-if="record.editable && col == 'quality'" :value="text" @change="e => handleChange(e, record.key, col)">
            <a-select-option v-for="(quality, index) in qualityOption" :key="index" :value="quality.name">{{ quality.name }}</a-select-option>
          </a-select>
          <a-select :key="col" style="width: 100px" v-if="record.editable && col == 'name'" :value="text" @change="e => handleChange(e, record.key, col)">
            <a-select-option v-for="(product, index) in productOption" :key="index" :value="product">{{ product }}</a-select-option>
          </a-select>
          <a-input
            :key="col"
            v-else-if="record.editable && col !== 'quality'"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else-if="!record.editable">{{ text }}</template>
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
    </a-spin>
    <div style="margin-top: 16px; margin-bottom: 8px; float: right;">
      <a-button type="dashed" @click="newMember">新增</a-button>
      <a-button @click="handleSubmit" type="primary" style="margin-left: 8px;">提交</a-button>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'BaseForm',
  data () {
    return {
      spinning: true,
      state: false,
      value: 1,
      typeOption: {},
      qualityOption: {},
      productOption: {},
      dateFormat: 'YYYY/MM/DD',
      loading: false,
      memberLoading: false,
      // table
      columns: [
        {
          title: '成色',
          dataIndex: 'quality',
          key: 'quality',
          align: 'center',
          scopedSlots: { customRender: 'quality' }
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '单价',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          align: 'center',
          scopedSlots: { customRender: 'unitPrice' }
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
      data: []
    }
  },
  created () {
    this.$http.get('/api/list').then(res => { this.typeOption = res.order; this.qualityOption = res.quality; this.productOption = res.product }).then(() => this.initValue(this.$route.query.type)).then(() => { this.spinning = false })
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    initValue (queryType) {
      switch (queryType) {
        case 'edit':
          this.state = true
          if (this.$route.query.code) {
            this.$http.get(`/api/company?code=${this.$route.query.code}`)
              .then(res => {
                this.data = JSON.parse(res.result[0].price_list)
                this.form.setFieldsValue({
                  code: res.result[0].code,
                  name: res.result[0].name,
                  remarks: res.result[0].remarks,
                  type: res.result[0].type
                })
              })
          }
          break
        case 'copy':
          if (this.$route.query.code) {
            this.$http.get(`/api/company?code=${this.$route.query.code}`)
              .then(res => {
                this.data = JSON.parse(res.result[0].price_list)
                this.form.setFieldsValue({
                  type: res.result[0].type
                })
              })
          }
          break
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let flag = false
          const dataList = []
          this.data.map((value) => {
            if (value.editable) {
              this.$message.error('请先保存条目！')
              flag = true
              return
            }
            dataList.push(value)
          })
          if (flag) {
            return
          }
          values.priceList = JSON.stringify(dataList)
          if (this.$route.query.type === 'edit') {
            this.$http.put('/api/company', values).then(res => {
              if (res.status === 'success') {
                this.$message.info('更新成功！')
              }
            })
          } else {
            this.$http.get(`/api/company?code=${values.code}`).then(res => {
              if (res.result.length > 0) {
                this.$message.info('客户编码已存在，请修改！')
                return false
              }
              this.$http.post('/api/company', values).then(res => {
                if (res.status === 'success') {
                  this.$message.info('提交成功！')
                  this.form.resetFields()
                  this.data = []
                }
              })
            })
          }
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
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow (record) {
      this.memberLoading = true
      const { key, quality, name, unitPrice } = record
      if (!quality) {
        this.memberLoading = false
        this.$message.warning('请填写成色！')
        return
      }
      if (!name) {
        this.memberLoading = false
        this.$message.warning('请填写品名！')
        return
      }
      if (!unitPrice) {
        this.memberLoading = false
        this.$message.warning('请填写单价！')
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
