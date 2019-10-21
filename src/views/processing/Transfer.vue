<template>
  <div>
    <div v-for="item in data" :key="item._id">
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      const res = await this.$http.get('/admin/api/rest/transfers')
      this.data = res
    }
  }
}
</script>
