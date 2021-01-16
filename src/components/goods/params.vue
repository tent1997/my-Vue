<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon>
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectKeys" :options="catesList" :props="props" @change="handleChange" clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-button type="primary" size="mini" :disabled="isButtonDisabled" @click="addParams">添加参数</el-button>
        <el-tab-pane label="动态参数" name="many">
          <el-table :data="manyParamsList" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
               <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i" @close="closeTag(scope.row,i)">
                {{item}}
              </el-tag>
              <el-input
                class="tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column prop="date" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-table :data="onlyParamsList" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
               <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i" @close="closeTag(scope.row,i)">
                {{item}}
              </el-tag>
              <el-input
                class="tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column prop="date" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title= "activeName === 'many' ? '添加动态参数' : '添加静态参数'"
      :visible.sync="addParamsdialogVisible"
      width="50%"
      @close="handleClose">
      <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态参数'" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="activeName === 'many' ? '修改动态参数' : '修改静态参数'"
      :visible.sync="editParamsdialogVisible"
      width="50%"
      @close="edithandleClose">
      <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsFormRef" label-width="100px">
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      catesList: [],
      manyParamsList: [],
      onlyParamsList: [],
      selectKeys: [],
      addParamsdialogVisible: false,
      editParamsdialogVisible: false,
      addParamsForm: {
        attr_name: '',
        attr_sel: ''
      },
      editParamsForm: {
        attr_name: '',
        attr_sel: ''
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      inputValue: '',
      inputVisible: false,
      cateId: 0,
      activeName: 'many',
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  created() {
    this.getCates()
  },
  computed: {
    isButtonDisabled() {
      return this.selectKeys.length !== 3
    }
  },
  methods: {
    async getCates() {
      const {
        data: res
      } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类信息失败！')
      this.catesList = res.data
    },
    async handleChange() {
      const { data: res } = await this.$http.get(`categories/${this.selectKeys[2]}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取参数失败！')
      if (this.activeName === 'many') {
        this.manyParamsList = res.data
      } else {
        this.onlyParamsList = res.data
      }
      console.log(this.manyParamsList)
    },
    handleClick() {
      this.handleChange()
    },
    closeTag(row, i) {
      row.attr_vals.splice(i, 1)
      console.log(row, i)
      this.saveActive(row)
    },
    async saveActive(row) {
      const { data: res } = await this.$http.put(`categories/${this.selectKeys[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) this.$message.error('修改参数失败！')
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      this.saveActive(row)
    },
    addParams() {
      this.addParamsdialogVisible = true
    },
    handleClose() {
      this.$refs.addParamsFormRef.resetFields()
    },
    addParamsDialog() {
      this.addParamsForm.attr_sel = 'many'
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.selectKeys[2]}/attributes`, this.addParamsForm)
        if (res.meta.status !== 201) return this.$message.error('添加参数失败！')
        this.handleChange()
        this.$message.success('添加参数成功！')
        this.addParamsdialogVisible = false
      })
    },
    async editParams(row) {
      this.editParamsdialogVisible = true
      this.editParamsForm.attr_id = row.attr_id
      const { data: res } = await this.$http.get(`categories/${this.selectKeys[2]}/attributes/${row.attr_id}`, {
        params: {
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败！')
      this.editParamsForm.attr_name = res.data.attr_name
    },
    edithandleClose() {
      this.$refs.editParamsFormRef.resetFields()
    },
    editParamsDialog() {
      this.editParamsForm.attr_sel = this.activeName
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.selectKeys[2]}/attributes/${this.editParamsForm.attr_id}`, this.editParamsForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改参数失败！')
        this.handleChange()
        this.$message.success('修改参数成功！')
        this.editParamsdialogVisible = false
      })
    },
    async removeParams(row) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(row)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除！')
      const { data: res } = await this.$http.delete(`categories/${this.selectKeys[2]}/attributes/${row.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.handleChange()
      this.$message.success('删除成功！')
    }
  }
}

</script>
<style lang="less" scoped>
  .el-row {
    margin-top: 15px;
  }
  .el-table {
    margin-top: 15px;
  }
  .el-tag {
    margin: 5px;
  }
  .tag {
    width: 120px;
  }
</style>
