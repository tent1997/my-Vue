<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delMessageBox(scope.row.id)"></el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightsDialog(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeDialog">
        <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog">
        <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="分配角色" :visible.sync="editRightsVisible" width="50%" @close="closeRightsDialog">
        <el-form :model="editRightsForm" ref="editRightsFormRef" label-width="100px">
          <el-form-item label="当前的用户">
            <el-input v-model="editRightsForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="当前的角色">
            <el-input v-model="editRightsForm.email"></el-input>
          </el-form-item>
          <p>分配新角色<el-select v-model="editRightsForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select></p>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRightsVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (!regEmail.test(value)) {
        return cb(new Error('请输入合法邮箱！'))
      }
      cb()
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (!regMobile.test(value)) {
        return cb(new Error('请输入合法电话！'))
      }
      cb()
    }
    return {
      userList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      addDialogVisible: false,
      editDialogVisible: false,
      addUserForm: {},
      editUserForm: {},
      addUserFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      },
      editUserFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]

      },
      editRightsVisible: false,
      userId: '',
      options: {},
      editRightsForm: {}
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userState(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error('更改用户状态失败！')
      }
      this.$message.success('更改用户状态成功！')
    },
    showDialog() {
      this.addDialogVisible = true
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败！')
      this.editUserForm = res.data
    },
    closeDialog() {
      this.$refs.addUserFormRef.resetFields()
    },
    closeEditDialog() {
      this.$refs.editUserFormRef.resetFields()
    },
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.addDialogVisible = false
        this.getUserList()
        this.$message.success('添加用户成功！')
      })
    },
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, this.editUserForm)
        if (res.meta.status !== 200) return this.$message.error('修改用户失败！')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功！')
      })
    },
    async delMessageBox(id) {
      console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除！')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.getUserList()
      this.$message.success('删除用户成功！')
    },
    async showRightsDialog(id) {
      this.userId = id
      this.editRightsVisible = true
      this.getOptions()
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败！')
      this.editRightsForm = res.data
    },
    async getOptions() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.options = res.data
    },
    closeRightsDialog() {
      // this.$refs.editRightsFormRef.resetFields()
      this.editRightsForm = {}
    },
    async editRights() {
      const { data: res } = await this.$http.put(`users/${this.editRightsForm.id}/role`, { rid: this.editRightsForm.rid })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('角色分配失败！')
      this.getUserList()
      this.editRightsVisible = false
      this.$message.success('分配角色成功！')
    }
  }
}
</script>
<style lang="less" scoped>
p {
  margin-left: 17px;
}
.el-select {
  margin-left: 14px;
  }
</style>
