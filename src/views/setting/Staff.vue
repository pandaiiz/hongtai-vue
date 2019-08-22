<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <router-link :to="{ name:'StaffList' }">
      <a-button type="primary">
        <a-icon type="left" />员工列表
      </a-button>
    </router-link>
    <a-spin tip="加载中..." :spinning="spinning">
      <a-form :form="form">
        <a-form-item
          label="编码"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'code',
              {rules: [{ required: true, message: '请输入员工编码' }]}
            ]"
            name="name"
            placeholder="员工编码" />
        </a-form-item>
        <a-form-item
          label="姓名"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入员工姓名' }]}
            ]"
            name="name"
            placeholder="员工姓名" />
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
          label="部门"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            v-decorator="[
              'department',
              {rules: [{ required: true, message: '请选择员工所在部门' }]}
            ]"
            placeholder="请选择员工所在部门">
            <a-select-option v-for="type in department" :key="type">{{ type }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
    <div style="margin-top: 16px; margin-bottom: 8px; float: right;">
      <a-button @click="handleSubmit" type="primary" style="margin-left: 8px;">提交</a-button>
    </div>
  </a-card>
</template>

<script>

export default {
  data () {
    return {
      department: [],
      spinning: false,
      dateFormat: 'YYYY/MM/DD'
    }
  },
  created () {
    this.$http.get('/api/list').then(res => { this.department = res.department })
    if (this.$route.query.code) {
      this.spinning = true
      this.$http.get(`/api/staff?code=${this.$route.query.code}`).then(res => {
        this.form.setFieldsValue({
          code: res.data[0].code,
          name: res.data[0].name,
          remarks: res.data[0].remarks,
          department: res.data[0].department
        })
        this.spinning = false
      })
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.$http.post('/api/staff', values).then(res => {
          if (res.status === 'success') {
            this.$message.success('提交成功！')
            this.form.resetFields()
          }
        })
      })
    }
  }
}
</script>
