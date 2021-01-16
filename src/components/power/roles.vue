<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1===0 ? 'bdtop' : '','vertail']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <el-col :span="5"><el-tag closable @close="closeTag(scope.row, item1.id)">{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="['vertail',i2===0 ? '' : 'bdtop']">
                  <el-col :span="6"><el-tag type="success" closable @close="closeTag(scope.row, item2.id)">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                  <el-col :span="18"><el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="closeTag(scope.row, item3.id)">{{item3.authName}}</el-tag></el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="date" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close="closeDialog">
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <el-dialog title="修改角色" :visible.sync="editRoleVisible" width="50%" @close="closeEditDialog">
        <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="权限分配" :visible.sync="editRightsVisible" width="50%">
      <el-tree
        :data="rightsList"
        :props="props"
        node-key="id"
        show-checkbox
        :default-checked-keys="checkedRights"
        default-expand-all
        ref="tree">
      </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRightsVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRights">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      addRoleForm: {},
      addRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }]
      },
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }]
      },
      addRoleVisible: false,
      editRoleVisible: false,
      editRightsVisible: false,
      rightsList: [],
      checkedRights: [],
      roleId: '',
      props: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const {
        data: res
      } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败！')
      this.rolesList = res.data
    },
    showDialog() {
      this.addRoleVisible = true
    },
    closeDialog() {
      this.$refs.addRoleFormRef.resetFields()
    },
    async addRole() {
      const { data: res } = await this.$http.post('roles', this.addRoleForm)
      if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
      this.addRoleVisible = false
      this.getRolesList()
      this.$message.success('添加角色成功！')
    },
    async showEditDialog(id) {
      this.editRoleVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败！')
      this.editRoleForm = res.data
    },
    closeEditDialog() {
      this.$refs.editRoleFormRef.resetFields()
    },
    async editRole() {
      const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId, this.editRoleForm)
      if (res.meta.status !== 200) return this.$message.error('修改角色信息失败！')
      this.$message.success('修改角色信息成功！')
      this.getRolesList()
      this.editRoleVisible = false
    },
    async deleteRole(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除！')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.getRolesList()
      this.$message.success('删除成功！')
    },
    async closeTag(role, id) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除！')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
      role.children = res.data
      this.$message.success('删除成功！')
    },
    showRightsDialog(role) {
      this.roleId = role.id
      this.editRightsVisible = true
      this.getRights()
      this.checkedRights = []
      this.getcheckedRights(role, this.checkedRights)
    },
    async getRights() {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.rightsList = res.data
    },
    getcheckedRights(role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach(item => this.getcheckedRights(item, arr))
    },
    async editRights() {
      const defKeys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      const idStr = defKeys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('权限分配失败！')
      this.getRolesList()
      this.editRightsVisible = false
      this.$message.success('权限设置成功！')
    }
  }
}

</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.el-row {
  margin: 0;
}
.vertail {
  display: flex;
  align-items: center;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-icon-caret-right {
  font-size: 16px;
}
</style>
