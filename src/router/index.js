import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cates from '../components/goods/cates.vue'
import Params from '../components/goods/params.vue'
import Goods from '../components/goods/goods.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/order.vue'
import Reports from '../components/order/reports.vue'
Vue.use(VueRouter)
const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/rights',
    component: Rights
  },
  {
    path: '/roles',
    component: Roles
  },
  {
    path: '/categories',
    component: Cates
  },
  {
    path: '/params',
    component: Params
  },
  {
    path: '/goods',
    component: Goods
  },
  {
    path: '/goods/add',
    component: Add
  },
  {
    path: '/orders',
    component: Order
  },
  {
    path: '/reports',
    component: Reports
  }
  ]
}
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
