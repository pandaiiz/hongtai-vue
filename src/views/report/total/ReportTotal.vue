<template>
  <a-card :bordered="false">
    <div class="title">部门详情</div>
    <s-table
      style="margin-bottom: 24px"
      row-key="id"
      :showPagination="false"
      :columns="goodsColumns"
      :data="loadGoodsData">
    </s-table>
  </a-card>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import DetailList from '@/components/tools/DetailList'
import { getStatistics } from '@/api/manage'
import moment from 'moment'
const DetailListItem = DetailList.Item

export default {
  components: {
    PageView,
    DetailList,
    DetailListItem,
    STable
  },
  data () {
    return {
      query: { type: 'full', time: moment().format('YYYY-MM-DD') },
      goodsColumns: [
        {
          title: '部门',
          dataIndex: 'department'
        },
        {
          title: '成品',
          dataIndex: 'cp_weight'
        },
        {
          title: '发货',
          dataIndex: 'send_weight'
        },
        {
          title: '废品',
          dataIndex: 'fp_weight'
        },
        {
          title: '退货',
          dataIndex: 'th_weight'
        },
        {
          title: '粉/线',
          dataIndex: 'fx_weight'
        },
        {
          title: '损耗',
          dataIndex: 'lost_weight'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadGoodsData: () => {
        return getStatistics(this.query)
          .then(res => {
            console.log(res)
            // res.data.push(res.total)
            const list = { data: res.data, pageSize: 30, pageNo: 1, totalPage: 1, totalCount: 1 }
            return list
          })
      }
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'processing': '进行中',
        'success': '完成',
        'failed': '失败'
      }
      return statusMap[status]
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  }

}
</script>

<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>
