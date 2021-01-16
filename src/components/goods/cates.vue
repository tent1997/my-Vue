<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="catesList"
        style="width: 100%"
        :columns="columns"
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag effect="dark" size="mini" v-if="scope.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag
            effect="dark"
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag effect="dark" type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editCates(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCates(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="catesDialogVisible" width="50%" @close="closeAddCates">
      <el-form ref="catesform" :model="catesform" :rules="catesRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="catesform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="addCatesLIst"
            :props="props"
            @change="parentCateChange"
            clearable change-on-select
            expandTrigger='hover'
            ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="catesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCates">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      catesList: [],
      selectedKeys: [],
      catesform: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 2
      },
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      catesDialogVisible: false,
      catesRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addCatesLIst: []
    }
  },
  created() {
    this.getCates()
  },
  methods: {
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCates()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCates()
    },
    async getCates() {
      console.log(this.queryInfo)
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.catesList = res.data.result
      this.total = res.data.total
    },
    async deleteCates(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除！')
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.getCates()
      this.$message.success('删除成功！')
    },
    closeAddCates() {
      this.$refs.catesform.resetFields()
    },
    async addCate() {
      this.catesDialogVisible = true
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      this.addCatesLIst = res.data
    },
    parentCateChange() {
      if (this.selectedKeys.length !== 0) {
        this.catesform.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.catesform.cat_level = this.selectedKeys.length
        return
      }
      this.catesform.cat_pid = 0
      this.catesform.cat_level = 0
    },
    async addCates() {
      const { data: res } = await this.$http.post('categories', this.catesform)
      if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
      this.$message.success('添加分类成功！')
      this.getCates()
      this.catesDialogVisible = false
      this.selectedKeys = []
      this.$refs.catesform.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
