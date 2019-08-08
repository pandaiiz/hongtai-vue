<template>
  <a-table
    :columns="columns"
    :dataSource="data"
    :pagination="false"
    bordered
    size="small"
  />
</template>
<script>
import { getInfoList } from '@/api/manage'
import pinyin from 'pinyin'

export default {
  created () {
    this.initColumns()
    this.loadPrice()
  },
  data () {
    return {
      data: [],
      columns: [{
        title: '客户',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        align: 'center',
        width: 80
      }]
    }
  },
  methods: {
    initColumns () {
      getInfoList()
        .then(res => {
          for (const name in res.price) {
            const children = []
            res.price[name].map((value) => {
              const keyIndex = pinyin(`${name + value}`, {
                style: pinyin.STYLE_NORMAL,
                heteronym: true
              }).join('').toLowerCase()
              children.push({
                title: value,
                align: 'center',
                dataIndex: keyIndex
              })
            })
            this.columns.push({
              title: name,
              children: children
            })
          }
        })
    },
    loadPrice () {
      this.$http.get('/api/company').then(res => {
        if (res.status === 'success') {
          res.data.map((value) => {
            const priceList = JSON.parse(value.price_list)
            const company = {}
            company['name'] = value.name
            company['key'] = value.code
            priceList.map((price) => {
              const keyIndex = pinyin(`${price.quality + price.name}`, {
                style: pinyin.STYLE_NORMAL,
                heteronym: true
              }).join('').toLowerCase()
              company[keyIndex] = price.unitPrice
            })
            this.data.push(company)
          })
        }
      })
    }
  }
}
</script>
