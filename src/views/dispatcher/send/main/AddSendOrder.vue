<template>
  <span>
    <a-button type="primary" @click="showModal" style="margin-left: 8px;">新增传递单</a-button>
    <a-modal
      title="新增传递单"
      :visible="visible"
      @cancel="handleCancel">
      <template slot="footer">
        <a-button v-if="!barcode" key="submit" type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
        <a-button key="back" @click="print">打印</a-button>
      </template>
      <a-form v-if="!barcode" :form="form">
        <a-form-item label="板料">
          <a-input
            v-decorator="[
              'weight',
              {rules: [{ required: true, message: 'Please input your note!' }]}]"
            placeholder="请输入此单的重量"/>
        </a-form-item>
        <a-form-item label="件数">
          <a-input
            v-decorator="[
              'number',
              {rules: [{ required: true, message: 'Please input your note!' }]}]"
            placeholder="请输入此单的件数"/>
        </a-form-item>
        <a-form-item
          label="成色">
          <a-select
            :options="data.quality"
            v-decorator="[
              'quality',
              {rules: [{ required: true, message: 'Please input your note!' }]}]"
            placeholder="请输入此单的重量"/></a-select>
        </a-form-item>
        <a-form-item
          label="产品">
          <a-select
            :options="data.product"
            v-decorator="[
              'product',
              {rules: [{ required: true, message: 'Please input your note!' }]}]"
            placeholder="请输入此单的重量"/></a-select>
        </a-form-item>
      </a-form>
      <barcode v-if="barcode" :value="barcode">
        Show this if the rendering fails.
      </barcode>
    </a-modal>
  </span>
</template>

<script>
import { getInfoList } from '@/api/manage'
import VueBarcode from 'vue-barcode'
export default {
  name: 'AddSendOrder',
  components: {
    'barcode': VueBarcode
  },
  data () {
    return {
      visible: false,
      loading: false,
      form: this.$form.createForm(this),
      barcode: '',
      data: {
        quality: [],
        product: []
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$http.post('/api/warehouse/send/create', values).then(res => { this.loading = false; this.barcode = res.result.insertId })
        }
      })
    },
    init () {
      getInfoList().then(res => {
        const productList = []
        res.product.map((val) => {
          const product = {}
          product['value'] = val
          product['label'] = val
          productList.push(product)
        })
        const qualityList = []
        res.quality.map((val) => {
          const quality = {}
          quality['value'] = val.name
          quality['label'] = val.name
          qualityList.push(quality)
        })
        this.data.quality = qualityList
        this.data.product = productList
      })
    },
    showModal () {
      this.visible = true
    },
    print () {
      console.log('打印')
    },
    handleCancel (e) {
      this.visible = false
      this.barcode = null
    }
  }
}
</script>
