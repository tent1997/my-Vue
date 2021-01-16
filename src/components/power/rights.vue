<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRights()
  },
  methods: {
    async getRights() {
      const {
        data: res
      } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.rightsList = res.data
    }
  }
}

</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
