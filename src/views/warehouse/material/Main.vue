<template>
  <div>
    数据：
    <div v-for="item in details" :key="item.key">
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      details: []
    }
  },
  created () {
    this.loadDetails()
  },
  methods: {
    loadDetails () {
      this.$http.get('/api/warehouse/material').then(res => { this.details = res.result })
    }
  }
}
</script>
