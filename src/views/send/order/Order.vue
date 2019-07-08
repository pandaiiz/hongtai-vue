<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-row :gutter="8">
      <a-col :span="12">
        <a-form-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          label="日期"
        >
          <a-date-picker :defaultValue="moment()" :format="dateFormat" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="出入库"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-radio-group buttonStyle="solid">
            <a-radio-button value="in">入库</a-radio-button>
            <a-radio-button value="out">出库</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="客户编码"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-input placeholder="请输入客户编码" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="客户名称"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-input placeholder="请输入客户名称" />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          label="类型"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 22 }"
        >
          <a-radio-group buttonStyle="solid">
            <a-radio-button value="in">11</a-radio-button>
            <a-radio-button value="out">22</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 22 }"
        >

        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          v-for="k in form.getFieldValue('keys')"
          :key="k"
          :required="false"
          :wrapper-col="{ span: 24 }"
        >
          <a-input
            v-decorator="[
              `names[${k}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input passenger\'s name or delete this field.',
                }],
              }
            ]"
            placeholder="订单号"
            style="width: 10%; margin-right: 8px"
          />
          <a-input
            v-decorator="[
              `names[${k}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input passenger\'s name or delete this field.',
                }],
              }
            ]"
            placeholder="款号"
            style="width: 10%; margin-right: 8px"
          />
          <a-input
            v-decorator="[
              `names[${k}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input passenger\'s name or delete this field.',
                }],
              }
            ]"
            placeholder="货品名称"
            style="width: 10%; margin-right: 8px"
          />
          <a-input
            v-decorator="[
              `names[${k}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input passenger\'s name or delete this field.',
                }],
              }
            ]"
            placeholder="成色"
            style="width: 10%; margin-right: 8px"
          />
          <a-input
            v-decorator="[
              `names[${k}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input passenger\'s name or delete this field.',
                }],
              }
            ]"
            placeholder="数量（件）"
            style="width: 10%; margin-right: 8px"
          />
          <a-input
            v-decorator="[
              `names[${k}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input passenger\'s name or delete this field.',
                }],
              }
            ]"
            placeholder="重量（g）"
            style="width: 10%; margin-right: 8px"
          />
          <a-input
            v-decorator="[
              `names[${k}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input passenger\'s name or delete this field.',
                }],
              }
            ]"
            placeholder="单价"
            style="width: 10%; margin-right: 8px"
          />
          <a-input
            v-decorator="[
              `names[${k}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input passenger\'s name or delete this field.',
                }],
              }
            ]"
            placeholder="合计工费"
            style="width: 10%; margin-right: 8px"
          />
          <a-input
            v-decorator="[
              `names[${k}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input passenger\'s name or delete this field.',
                }],
              }
            ]"
            placeholder="备注"
            style="width: 10%; margin-right: 8px"
          />
          <a-icon
            v-if="form.getFieldValue('keys').length > 1"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="form.getFieldValue('keys').length === 1"
            @click="() => remove(k)"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item :wrapper-col="{ span: 6,offset: 20 }">
          <a-button type="dashed" @click="add">
            <a-icon type="plus" />新增
          </a-button>
          <a-button type="primary" html-type="submit" style="margin-left: 8px;">提交</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import moment from 'moment'
let id = 0
export default {
  data () {
    return {
      dateFormat: 'YYYY/MM/DD'
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  methods: {
    moment,
    remove (k) {
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      // We need at least one passenger
      console.log(k)
      if (keys.length === 1) {
        return
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },

    add () {
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(++id)
      console.log(nextKeys)
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys
      })
    },

    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  width: 0;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
