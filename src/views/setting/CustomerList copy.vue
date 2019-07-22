<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item">
      {{ item }}
      <a-list-item-meta
        :description="`客户编码：${item.code}`"
      >
        <a slot="title" href="https://vue.ant.design/">{{ item.name }}</a>
        <!-- <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> -->
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>
<script>
let data
export default {
  data () {
    return {
      data
    }
  },
  created () {
    this.$http.get('/api/company').then(res => {
      if (res.status === 'success') {
        this.data = res.data
      }
    })
  }
}
</script>
