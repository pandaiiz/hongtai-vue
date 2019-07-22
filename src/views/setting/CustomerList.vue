<template>
  <div>
    <template>
      <a-row :gutter="20">
        <a-col :sm="8" :md="6" :xl="6" v-for="company in companyList" :key="company.code">
          <a-card hoverable>
            <template class="ant-card-actions" slot="actions">
              <a-icon type="ellipsis" />
              <a-icon type="edit" />
              <a-icon type="delete" />
            </template>
            <a-card-meta
              :title="company.name"
              :description="`备注：${company.remarks}`">
              <!-- <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> -->
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeKey: [],
      companyList: []
    }
  },
  created () {
    this.$http.get('/api/company').then(res => {
      if (res.status === 'success') {
        this.companyList = res.data
        this.activeKey = ['1']
        console.log(res.data)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.ant-card {
  margin-bottom: 20px;
}
</style>
