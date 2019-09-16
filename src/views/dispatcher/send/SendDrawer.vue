<template>
  <span>
    <a-button style="margin-left: 8px" type="primary" @click="showDrawer">
      <a-icon type="plus" /> 新增
    </a-button>
    <a-drawer
      title="新建收发"
      :width="900"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">
      <a-form :form="form" layout="vertical" hideRequiredMark @submit="handleSubmit">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="传递单ID">
              <a-input
                @blur="scan"
                placeholder="请输入ID"
                v-decorator="[
                  'id', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请输入ID' }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="员工">
              <a-input
                @blur="loadStaff"
                placeholder="请输入员工ID"
                v-decorator="[
                  'staff',
                  {rules: [{ required: true, message: '请输入员工ID' }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="部门">
              <a-select
                v-decorator="[
                  'department', // 给表单赋值或拉取表单时，该input对应的key
                  {rules: [{ required: true, message: '请选择部门' }]}
                ]"
                placeholder="请选择部门"
              >
                <a-select-option v-for="item in infoList.department" :key="item" :value="item">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
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
          <a-col :span="6">
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
            <a-form-item label="出库/入库">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'type',
                  {rules: [{ required: true, message: '请选择发货类型' }]}
                ]">
                <a-radio-button value="1">发货</a-radio-button>
                <a-radio-button value="2">收货</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="类别">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'category',
                  {rules: [{ required: true, message: '请选择类别' }]}
                ]">
                <a-radio-button v-for="item in infoList.category" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="成色">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="[
                  'quality',
                  {rules: [{ required: true, message: '请选择成色' }], initialValue: ''}
                ]">
                <a-radio-button v-for="item in infoList.quality" :key="item.name" :value="item.name">{{ item.name }}</a-radio-button>
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
                <a-radio-button v-for="item in infoList.product" :key="item" :value="item">{{ item }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="supplement">
            <a-form-item label="补录日期">
              <a-date-picker
                v-decorator="[
                  'supplement'
                ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="showRemarks">
            <a-form-item label="备注">
              <a-textarea
                v-decorator="[
                  'remarks'
                ]"
                placeholder="请输入备注"
                autosize
              />
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
            @click="showRemarksToggle">
            备注
          </a-button>
          <a-button
            :style="{marginRight: '8px'}"
            @click="supplementDate">
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
  </span>
</template>
<script>
import { getInfoList } from '@/api/manage'
import { saveMachining, scanMachining } from '@/api/send'
import { getStaff } from '@/api/staff'
export default {
  name: 'SendDrawer',
  data () {
    return {
      showRemarks: false,
      form: this.$form.createForm(this),
      infoList: {},
      supplement: false
    }
  },
  mounted () {
    this.form = this.$form.createForm(this)
  },
  created () {
    getInfoList()
      .then(res => {
        this.infoList = res
      })
  },
  props: {
    'visible': {
      default: false,
      type: [Boolean]
    },
    'fillData': {
      default: () => {},
      type: [Object]
    },
    'balancePort': {
      default: '',
      type: [String]
    }
  },
  watch: {
    visible (open) {
      if (open) {
        if (this.fillData.remarks) {
          this.showRemarks = true
          setTimeout(() => {
            this.form.setFieldsValue({
              remarks: this.fillData.remarks
            })
          }, 0)
        }
        setTimeout(() => {
          this.form.setFieldsValue({
            id: this.fillData.id,
            number: this.fillData.number,
            weight: this.fillData.weight,
            quality: this.fillData.quality,
            product: this.fillData.product,
            staff: this.fillData.staff,
            department: this.fillData.department
          })
        }, 0)
      }
    }
  },
  methods: {
    showRemarksToggle () {
      this.showRemarks = !this.showRemarks
    },
    supplementDate () {
      this.supplement = !this.supplement
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
    showDrawer () {
      this.$emit('update:visible', true)
      this.$emit('update:fillData', {})
      this.showRemarks = false
      this.supplement = false
    },
    clearSubmit () {
      this.form.resetFields()
      this.supplement = false
      this.showRemarks = false
    },
    scan (e) {
      scanMachining({ id: e.target.value }).then(res => {
        if (res.result.length > 0) {
          if (res.result[0].remarks) {
            this.showRemarks = true
            setTimeout(() => {
              this.form.setFieldsValue({
                remarks: res.result[0].remarks
              })
            }, 0)
          }
          this.form.setFieldsValue({
            number: res.result[0].number,
            weight: res.result[0].weight,
            quality: res.result[0].quality,
            product: res.result[0].product
          })
        } else {
          this.form.resetFields(['number', 'weight', 'remarks', 'department', 'category', 'quality', 'product', 'type', 'store'])
        }
      })
    },
    onClose () {
      this.$emit('update:visible', false)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          saveMachining(values).then(res => {
            if (res.state === 'success') {
              this.$message.info('新增成功！')
              this.$emit('update:visible', false)
              this.$emit('refresh')
              this.form.resetFields()
            }
          })
        }
      })
    },
    loadStaff (e) {
      if (!e.target.value) {
        return
      }
      getStaff({ code: e.target.value }).then(res => {
        this.form.setFieldsValue({
          department: res.result[0].department,
          staff: res.result[0].name
        })
      })
    }
  }
}
</script>
