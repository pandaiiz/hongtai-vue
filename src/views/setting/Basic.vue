<template>
  <div>
    <a-card
      style="width:100%"
      :tabList="tabList"
      :activeTabKey="noTitleKey"
      @tabChange="key => onTabChange(key)">
      <p>
        <template v-for="(item, key) in currentContent">
          <a-popconfirm
            v-if="noTitleKey !== 'quality' && noTitleKey !== 'price'"
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
        <template v-if="noTitleKey === 'price'">
          <div>
            <a-card
              style="width:100%"
              :tabList="priceTitle"
              :activeTabKey="priceTitleKey"
              @tabChange="key => priceTabChange(key, 'priceTitleKey')"
            >
              <a-transfer
                :dataSource="priceData"
                :titles="['可选', '表头']"
                :targetKeys="targetKeys"
                @change="handleChange"
                @selectChange="handleSelectChange"
                :render="item=>item.title"
              />
              <a-button @click="saveTargetHeader">保存</a-button>
            </a-card>
          </div>
        </template>
        <a-input-group compact style="margin-top: 24px;" v-if="noTitleKey !== 'price'">
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
        <a-button v-if="noTitleKey !== 'price'" @click="submitData" style="margin-top: 24px;">新增</a-button>
      </p>
    </a-card>
  </div>
</template>

<script>
import { getInfoList } from '@/api/manage'
export default {
  data () {
    return {
      priceData: [],
      targetKeys: [],
      addText: '',
      percentText: '',
      list: {},
      currentContent: {},
      tabList: [
        { key: 'department', tab: '部门' },
        { key: 'category', tab: '类别' },
        { key: 'product', tab: '产品' },
        { key: 'quality', tab: '成色' },
        { key: 'order', tab: '收发单品类' },
        { key: 'price', tab: '价格明细' },
        { key: 'store', tab: '仓库' }
      ],
      priceTitle: [],
      noTitleKey: '',
      priceTitleKey: ''
    }
  },
  created () {
    getInfoList()
      .then(res => {
        const priceTitleArray = []
        res.quality.map((tab, key) => {
          priceTitleArray.push({ key: tab.name, tab: tab.name })
        })
        res.product.map((product) => {
          this.priceData.push({ key: product, title: product })
        })
        this.list = res
        this.priceTitle = priceTitleArray
        this.priceTitleKey = priceTitleArray[0].key
        this.targetKeys = res.price[priceTitleArray[0].key]
        this.noTitleKey = 'department'
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
    onTabChange (key) {
      this.currentContent = this.list[key]
      this.noTitleKey = key
    },
    handleChange (nextTargetKeys, direction, moveKeys) {
      nextTargetKeys.find((item, key) => {
        if (!this.list.product.includes(item)) {
          nextTargetKeys.splice(key, 1)
        }
      })
      this.targetKeys = nextTargetKeys
      this.list.price[this.priceTitleKey] = nextTargetKeys
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    priceTabChange (key, type) {
      this.targetKeys = this.list.price[key]
      this[type] = key
    },
    saveTargetHeader () {
      const data = { type: 'price', data: this.list.price }
      this.$http.put('/api/list', data).then(res => {
        if (res.status === 'success') {
          this.$message.success('修改成功！')
        }
      })
    }
  }
}
</script>
