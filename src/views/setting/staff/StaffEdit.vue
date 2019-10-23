<template>
  <a-card>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item :wrapper-col="{ span: 12, offset: 0 }">
        <a-button @click="() => $router.push({ name: 'StaffList' })" style="margin-right: 8px;">
          返回
        </a-button>
        <a-button type="primary" html-type="submit">
          提交
        </a-button>
      </a-form-item>
      <a-form-item label="员工姓名" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-input
          v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' }] }]"
        />
      </a-form-item>
      <a-form-item label="员工编码" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-input
          v-decorator="['staffCode', { rules: [{ required: true, message: 'Please input your note!' }] }]"
        />
      </a-form-item>
      <a-form-item label="所属部门" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-select
          v-decorator="['department', { rules: [{ required: true, message: 'Please input your note!' }] }]">
          <a-select-option v-for="item in options" :key="item.name" :value="item.name">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { getStaff } from '@/api/staff'
export default {
  data () {
    return {
      data: {},
      options: []
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.init()
    if (!this.$route.query.id) return
    getStaff(this.$route.query.id).then((res) => {
      this.form.setFieldsValue({
        name: res.name,
        staffCode: res.staffCode,
        department: res.department
      })
    })
  },
  methods: {
    init () {
      this.$http.get(`/admin/api/rest/settings?field=department`).then((res) => { this.options = res.options })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.$route.query.id) this.$http.put(`/admin/api/rest/staffs/${this.$route.query.id}`, values).then(res => { if (res.success) this.$message.success('提交成功！') })
          else this.$http.post(`/admin/api/rest/staffs`, values).then(res => { if (res) this.$message.success('提交成功！') })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
</style>
