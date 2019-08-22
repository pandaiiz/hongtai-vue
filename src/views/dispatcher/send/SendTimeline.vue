<template>
  <a-card>
    <router-link :to="{ name:'SendReceive' }">
      <a-button type="primary">
        <a-icon type="left" />收发管理
      </a-button>
    </router-link>
    <a-divider />
    <a-timeline :pending="ending">
      <a-timeline-item v-for="(option, key) in data" :key="key" :color="option.type === 'send' ? 'blue' : 'green'">
        {{ moment(option.timestamp).format('YYYY-MM-DD-HH:mm:ss') }} {{ option.department }} {{ option.staff }} {{ option.weight }}g {{ option.number }}件 {{ option.type === 'send' ? '发货' : '收货' }}
      </a-timeline-item>
    </a-timeline>
  </a-card>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      data: [],
      ending: '待完成...'
    }
  },
  created () {
    this.getSendById(this.$route.query.id)
  },
  methods: {
    moment,
    getSendById (id) {
      this.$http.get(`/api/data?id=${id}`).then(res => { this.data = res.data; res.data.map((val) => { if (val.store === '成品仓') { this.ending = false } }) })
    }
  }
}
</script>

<style>

</style>
