import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')

const StudentManage = () => import('../views/StudentManage.vue')
const MealCardManage = () => import('../views/MealCardManage.vue')
const DeviceManage = () => import('../views/DeviceManage.vue')
const AdminManager = () => import('../views/AdminManager.vue')
const CustomerManager = () => import('../views/CustomerManager.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children:[
      {
        path: '/studentmanage',
        name: '学生信息',
        component: StudentManage,
      },{
        path: '/mealcardmanage',
        name: '饭卡信息',
        component: MealCardManage,
      },{
        path: '/devicemanage',
        name: '设备终端信息',
        component: DeviceManage,
      },{
        path: '/customermanager',
        name: '消费信息',
        component: CustomerManager,
      },{
        path: '/adminmanager',
        name: '管理员信息',
        component: AdminManager,
      }]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
