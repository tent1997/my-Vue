<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getOrderList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getOrderList"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
     <el-table :data="orderList" style="width: 100%" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column prop="pay_status" label="是否付款">
        <template slot-scope="scope">
          <el-tag type="success" size="mini" effect="dark" v-if="scope.row.pay_status == 0">已付款</el-tag>
          <el-tag type="danger" size="mini" effect="dark" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column prop="create_time" label="下单时间">
        <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="120px">
        <template>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrder"></el-button>
          <el-tooltip class="item" effect="dark" content="物流信息" placement="top" :enterable="false">
          <el-button type="success" icon="el-icon-location" size="mini" @click="local"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
     </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="form.address1"
            :options="city"
            @change="handleChange"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="form.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="物流进度"
      :visible.sync="localdialogVisible"
      width="50%"
      @close="closelocal">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in localList"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </el-card>
</div>
</template>

<script>
import city from './citydata'
import localList from './local'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      dialogVisible: false,
      form: {
        address1: [],
        address2: ''
      },
      props: {
        label: 'label',
        value: 'value',
        children: 'children'
      },
      rules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      city: city,
      localdialogVisible: false,
      localList: localList,
      reverse: true
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const {data: res} = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) this.$message.error('获取数据失败！')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    async editOrder() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    edit() {
      this.$message.success('修改成功！')
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    handleChange() {
    },
    local() {
      this.localdialogVisible = true
      console.log(localList)
    },
    closelocal() {
      this.localdialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%
}
</style>
