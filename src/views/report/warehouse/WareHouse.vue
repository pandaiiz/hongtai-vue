<template>
  <a-table :columns="columns" :dataSource="data" :pagination="false" :rowKey="record => record.store">
    <template slot="store" slot-scope="text, record">
      <router-link :to="{ name:'WareHouseDetails', query: { store: record.store } }">
        {{ record.store }}
      </router-link>
    </template>
    <template slot="weightZt" slot-scope="text, record">
      {{ (parseFloat(record.sendWeightZt) - parseFloat(record.receiveWeightZt)).toFixed(2) }}
    </template>
    <template slot="numberZt" slot-scope="text, record">
      {{ (parseFloat(record.sendNumberZt) - parseFloat(record.receiveNumberZt)).toFixed(2) }}
    </template>
    <template slot="weightToday" slot-scope="text, record">
      {{ (parseFloat(record.sendWeight) - parseFloat(record.receiveWeight)).toFixed(2) }}
    </template>
    <template slot="numberToday" slot-scope="text, record">
      {{ (parseFloat(record.sendNumber) - parseFloat(record.receiveNumber)).toFixed(2) }}
    </template>
  </a-table>
</template>
<script>
const columns = [{
  title: '名称',
  dataIndex: 'store',
  align: 'center',
  scopedSlots: { customRender: 'store' }
}, {
  title: '昨日结余',
  children: [{
    dataIndex: 'weightZt',
    title: '重量',
    scopedSlots: { customRender: 'weightZt' },
    align: 'center'
  }, {
    dataIndex: 'numberZt',
    title: '数量',
    scopedSlots: { customRender: 'numberZt' },
    align: 'center'
  }]
}, {
  title: '今日结余',
  children: [{
    dataIndex: 'weightToday',
    title: '重量',
    scopedSlots: { customRender: 'weightToday' },
    align: 'center'
  }, {
    dataIndex: 'numberToday',
    title: '数量',
    scopedSlots: { customRender: 'numberToday' },
    align: 'center'
  }]
}]

export default {
  created () {
    this.$http.get('/api/store')
      .then(res => {
        this.data = res.data
      })
  },
  data () {
    return {
      data: [],
      columns
    }
  }
}
</script>
