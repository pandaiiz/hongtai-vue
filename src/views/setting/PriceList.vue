<template>
  <a-table
    :columns="columns"
    :dataSource="data"
    bordered
    size="middle"
    :scroll="{ x: '130%', y: 240 }"
  />
</template>
<script>
import { getInfoList } from '@/api/manage'
const columns = [{
  title: '客户名称',
  dataIndex: 'name',
  key: 'name',
  width: 100,
  fixed: 'left'
  // filters: [{
  //   text: 'Joe',
  //   value: 'Joe'
  // }, {
  //   text: 'John',
  //   value: 'John'
  // }],
  // onFilter: (value, record) => record.name.indexOf(value) === 0
}, {
  title: 'Other',
  children: [{
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 200,
    sorter: (a, b) => a.age - b.age
  }]
}, {
  title: 'Company',
  children: [{
    title: 'Company Address',
    dataIndex: 'companyAddress',
    key: 'companyAddress'
  }, {
    title: 'Company Name',
    dataIndex: 'companyName',
    key: 'companyName'
  }]
}, {
  title: 'Gender',
  dataIndex: 'gender',
  key: 'gender',
  width: 80
}]

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M'
  })
}

export default {
  created () {
    getInfoList()
      .then(res => {
        console.log(res.quality)
        console.log(res.product)
      })
  },
  data () {
    return {
      data,
      columns
    }
  }
}
</script>
