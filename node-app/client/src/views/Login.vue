<template>
  <div class="login">
    <section class="form-container">
      <div class="manage-tip">
        <span class="title">修宏网络传媒后台管理系统</span>
      </div>
      <el-form
        :model="loginUser"
        :rules="rules"
        ref="loginForm"
        class="login-form"
        label-width="60px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginUser.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginUser.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('loginForm')"
            class="submit-btn"
          >
            登  录
          </el-button>
        </el-form-item>
        <div class="tiparea">
          <p>还没有账号？现在<router-link to='/register'>注册</router-link></p>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  name: 'login',
  data () {
    return {
      loginUser: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {
            type: 'email',
            required: true,
            message: '邮箱格式不正确',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post('/api/users/login', this.loginUser).then(res => {
            // 登录成功
            const { token } = res.data
            localStorage.setItem('eleToken', token)
            const decode = jwtDecode(token) // 解析token
            // 存储数据
            this.$store.dispatch('setAuthenticated', !this.isEmpty(decode))
            this.$store.dispatch('setUser', decode)
            this.$router.push('/index') // 页面跳转
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    isEmpty (value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
.login
  position relative
  width 100%
  height 100%
  background url(../assets/images/bg.jpg) no-repeat center center
  background-size 100% 100%
  .form-container
    width 370px
    height 210px
    position absolute
    top 20%
    left 34%
    padding 25px
    border-radius 5px
    text-align center
    .manage-tip
      .title
        font-family "Microsoft YaHei"
        font-weight bold
        font-size 26px
        color #fff
    .login-form
      margin-top 20px
      background-color #fff
      padding 20px 40px 20px 20px
      border-radius 5px
      box-shadow 0px 5px 10px #ccc
      .submit-btn
        width 100%
      .tiparea
        text-align right
        font-size 12px
        color #333
      .tiparea p a
        color #409eff
</style>
