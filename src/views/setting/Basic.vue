<template>
  <div>
    <a-card
      style="width:100%"
      :tabList="tabList"
      :activeTabKey="noTitleKey"
      @tabChange="key => onTabChange(key)"
    >
      <p>
        <template v-for="(item, key) in currentContent">
          <a-popconfirm
            v-if="noTitleKey !== 'quality'"
            :key="key"
            title="确认要删除吗？"
            @confirm="deleteOption(item)"
            okText="是"
            cancelText="否">
            <a-icon slot="icon" type="question-circle-o" style="color: blue" />
            <a-button style="margin-right: 8px;" href="#">{{ item }}</a-button>
          </a-popconfirm>
          <a-popconfirm
            v-else-if="noTitleKey === 'quality'"
            :key="key"
            title="确认要删除吗？"
            @confirm="deleteOption(item.name)"
            okText="是"
            cancelText="否">
            <a-icon slot="icon" type="question-circle-o" style="color: blue" />
            <a-button style="margin-right: 8px;" href="#">{{ item.name }}({{ item.percent }}%)</a-button>
          </a-popconfirm>
        </template>
        <a-input-group compact style="margin-top: 24px;">
          <a-input addonBefore="名称" style="width: 20%" v-model="addText">
            <a-icon v-if="addText" slot="addonAfter" @click="clearSubmitData" type="close"/>
          </a-input>
        </a-input-group>
        <a-input-group compact v-if="noTitleKey === 'quality'" style="margin-top: 24px;">
          <a-input addonBefore="比例" style="width: 20%" v-model="percentText">
            <a-icon v-if="percentText" slot="addonAfter" @click="clearPercentData" type="close"/>
          </a-input>
          <span style="line-height: 32px;margin-left: 8px;">%</span>
        </a-input-group>
        <a-button @click="submitData" style="margin-top: 24px;">新增</a-button>
      </p>
    </a-card>
  </div>
</template>

<script>
import { getInfoList } from '@/api/manage'
export default {
  data () {
    return {
      addText: '',
      percentText: '',
      list: {},
      currentContent: {},
      tabList: [
        { key: 'department', tab: '部门' },
        { key: 'category', tab: '类别' },
        { key: 'product', tab: '产品' },
        { key: 'quality', tab: '成色' },
        { key: 'order', tab: '收发单品类' }
      ],
      noTitleKey: 'department'
    }
  },
  created () {
    getInfoList()
      .then(res => {
        this.list = res
        this.currentContent = this.list['department']
      })
  },
  methods: {
    submitData () {
      if (this.addText === '') {
        this.$message.warning('请填写内容！')
        return false
      }
      let data
      if (this.noTitleKey === 'quality') {
        if (this.percentText === '') {
          this.$message.warning('请填写比例！')
          return false
        }
        const qualityData = JSON.stringify({ name: this.addText, percent: this.percentText })
        data = { name: qualityData, type: this.noTitleKey }
      } else {
        data = { name: this.addText, type: this.noTitleKey }
      }
      this.$http.put('/api/list', data).then(res => {
        if (res.status === 'success') {
          getInfoList()
            .then(res => {
              this.list = res
              this.currentContent = res[this.noTitleKey]
              this.$message.success('新增成功！')
            })
        }
      })
    },
    clearSubmitData () {
      this.addText = ''
    },
    clearPercentData () {
      this.percentText = ''
    },
    deleteOption (name) {
      this.$http.delete(`/api/list?name=${name}&type=${this.noTitleKey}`).then(res => {
        if (res.status === 'success') {
          getInfoList()
            .then(res => {
              this.list = res
              this.currentContent = res[this.noTitleKey]
              this.$message.success('删除成功！')
            })
        }
      })
    },
    cancel (e) {
      console.log(e)
      this.$message.error('Click on No')
    },
    onTabChange (key) {
      this.currentContent = this.list[key]
      this.noTitleKey = key
    },
    log (ff) {
      console.log(ff)
    }
  }
}
</script>
