<template>
  <div>
    <template>
      <a-row :gutter="20">
        <a-col :sm="8" :md="6" :xl="6" v-for="(company, key) in companyList" :key="key">
          <a-card hoverable>
            <template class="ant-card-actions" slot="actions">
              <router-link :to="{ name:'CustomerInput', query: { type: 'edit', code: company.code } }">
                <a-icon type="edit" />
              </router-link>
              <router-link :to="{ name:'CustomerInput', query: { type: 'copy', code: company.code } }">
                <a-icon type="copy" />
              </router-link>
              <a-icon type="delete" @click="deleteOption(company.code)" />
            </template>
            <a-card-meta
              :title="company.name"
              :description="`备注：${company.remarks}`">
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
    this.$http.get('/api/company?type=full').then(res => {
      if (res.status === 'success') {
        this.companyList = res.data
        this.activeKey = ['1']
      }
    })
  },
  methods: {
    deleteOption (code) {
      const $this = this
      this.$confirm({
        title: '警告',
        content: `确认要删除此条信息吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          $this.$http.delete(`/api/company?code=${code}`).then(res => {
            if (res.status === 'success') {
              const companyKey = $this.companyList.findIndex((item, key) => item.code === code)
              $this.companyList.splice(companyKey, 1)
              $this.$message.info('删除成功！')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-card {
  margin-bottom: 20px;
}
</style>
