<template>
  <div>
    <a-card>
      <router-link :to="{ name: 'BillsOrderList' }">
        <a-button>返回</a-button>
      </router-link>
      <a-button>物料出入</a-button>
      <a-form :form="form">
        <a-row :gutter="8">
          <a-col :xs="8">
            <a-form-item label="入库材料" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-select
                v-decorator="[
                  'material',
                  {rules: [{ required: true, message: '请选择入库材料类型' }]}
                ]"
                placeholder="请选择入库材料类型">
                <a-select-option value="板料">板料</a-select-option>
                <a-select-option value="补口">补口</a-select-option>
              </a-select>
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
                  {rules: [{ required: true, message: '请选择出入库类型' }]}
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
            <a-form-item label="总重量(g)" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-input
                v-decorator="[
                  'weight',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div style="margin-top: 16px; margin-bottom: 8px; float: right;">
        <a-button v-if="!$route.query.id" @click="handleSubmit" type="primary" style="margin-left: 8px;">提交</a-button>
        <a-button @click="reset" type="primary" style="margin-left: 8px;">重置</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
// import { getCompanyList } from '@/api/manage'
import moment from 'moment'
export default {
  data () {
    return {
      companys: [{ code: 123, name: '测试公司' }],
      options: []
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.$http.get('/admin/api/rest/material').then((res) => {
      console.log(res)
    })
    // getCompanyList().then(res => { if (res.state === 'success') this.companys = res.result })
  },
  methods: {
    findCompanyName (e) {
      if (!e.target.value) {
        return
      }
      console.log('22')
      // getCompanyList({ code: e.target.value }).then(res => {
      //   if (res.state === 'success') {
      //     if (res.result.length > 0) {
      //       this.form.setFieldsValue({
      //         company_name: res.result[0].name
      //       })
      //     } else {
      //       this.$message.error('未查到此条用户编码')
      //     }
      //   }
      // })
    },
    moment,
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) values.weight = values.type === '入库' ? parseFloat(values.weight) : -parseFloat(values.weight)
        const submit = {
          state: true,
          weight: values.weight,
          material: values.material,
          from: '单据',
          company: {
            name: values.companyName,
            code: values.companyCode
          }
        }
        this.$http.post('/admin/api/rest/material', submit).then(res => {
          if (res._id) this.$message.info('新增成功！'); this.reset()
        })
      })
    },
    reset () {
      this.form.resetFields()
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
