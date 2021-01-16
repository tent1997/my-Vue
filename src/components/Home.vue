<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png">
        <span>黑马后台管理系统</span>
      </div>
      <el-button type="info" @click="back">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle" @click="toggle">|||</div>
        <el-menu :default-active="activePath" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse='iscollapse' :collapse-transition='false' router>
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconfont[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="savePath('/' + subitem.path)"><i class="el-icon-menu"></i><span>{{subitem.authName}}</span></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconfont: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      iscollapse: false,
      activePath: ''
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
    this.getMenuList()
  },
  methods: {
    back() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(this.menuList)
    },
    toggle() {
      this.iscollapse = !this.iscollapse
    },
    savePath(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}

</script>
<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;

    div {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 20px;

      span {
        margin-left: 20px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    .iconfont {
      margin-right: 20px;
    }
    .toggle {
      background-color: #4A5064;
      line-height: 24px;
      font-size: 10px;
      text-align: center;
      color: #fff;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background-color: #EAEDF1;
  }
</style>
