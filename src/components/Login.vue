<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form ref="loginFormRef" :model="login_form" :rules="login_form_rules" class="login_form">
                <el-form-item prop="username">
                <el-input prefix-icon="iconfont icon-user" v-model="login_form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="login_form.password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetFrom">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      login_form: {
        username: 'admin',
        password: '123456'
      },
      login_form_rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetFrom () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return this.$message.error('登录失败！')
        const { data: res } = await this.$http.post('/login', this.login_form)
        if (res.meta.status !== 200) this.$message.error(res.meta.mag)
        window.sessionStorage.setItem('token', res.data.token)
        console.log(res)
        this.$router.push('/home')
        this.$message.success('登录成功！')
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2D4C69;
        width: 100%;
        height: 100%;
        .login_box {
            width: 450px;
            height: 300px;
            background-color: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            border-radius: 3px;
            .avatar {
                width: 130px;
                height: 130px;
                border: 1px solid #eee;
                border-radius: 50%;
                padding: 10px;
                background-color: #fff;
                box-shadow: 0 0 10px #fff;
                position: absolute;
                left: 50%;
                transform: translate(-50%,-50%);
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #ddd;
                }
            }
            .login_form {
                position: absolute;
                bottom: 0;
                padding: 0 20px;
                width: 100%;
                box-sizing: border-box;
                .btns {
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
    }
</style>
