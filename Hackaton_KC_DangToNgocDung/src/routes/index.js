import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/views/DashboardPage.vue'
import ManagerProductPage from '@/views/ManagerProductPage.vue'
import ManagerCategoryPage from '@/views/ManagerCategoryPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes:[
    {
      path: "/",
      alias: ["/admin", "/dashboard",],
      component: import(/* webpackChunkName: "Dashboard" */ "@/views/DashboardPage.vue"),
      name: "dashboard",
    },
    {
      path: "/admin/manager-category",
      component: import(
        /* webpackChunkName: "ManagerCategoryPage" */ "@/views/ManagerCategoryPage.vue"
      ),
      name: "manager-category",
    },
    {
      path: "/admin/manager-product",
      component: import(
        /* webpackChunkName: "ManagerProductPage" */ "@/views/ManagerProductPage.vue"
      ),
      name: "manager-product",
    },
]
})
export default router;
