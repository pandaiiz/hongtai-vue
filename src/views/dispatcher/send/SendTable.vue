<template>
  <div>
    {{ psMsg }}
  </div>
</template>

<script>
export default {
  name: 'SendTable',
  data () {
    return {
    }
  },
  props: {
    'psMsg': {
      default: 0,
      type: [String, Number]
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
