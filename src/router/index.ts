import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import { registerNavigationGuard } from "@/router/guard"

const VITE_PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH

const VITE_ROUTER_HISTORY = import.meta.env.VITE_ROUTER_HISTORY

/** 系统页面 */
export const systemRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    component: () => import("@/pages/error/403.vue"),
    name: "403",
    meta: {
      title: "403"
    }
  },
  {
    path: "/404",
    component: () => import("@/pages/error/404.vue"),
    name: "404",
    meta: {
      title: "404"
    },
    alias: "/:pathMatch(.*)*"
  }
]

/** 业务页面 */
export const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    name: "Login",
    meta: {
      title: "登录"
    }
  },
  {
    path: "/",
    component: () => import("@/pages/home/index.vue"),
    name: "Home",
    meta: {
      title: "首页"
    }
  },
  {
    path: "/activity/list",
    component: () => import("@/pages/activity/list/index.vue"),
    name: "ActivityList",
    meta: {
      title: "活动列表"
    }
  }
]

/** 路由实例 */
export const router = createRouter({
  history: VITE_ROUTER_HISTORY === "hash" ? createWebHashHistory(VITE_PUBLIC_PATH) : createWebHistory(VITE_PUBLIC_PATH),
  routes: [...systemRoutes, ...routes]
})

// 注册路由导航守卫
registerNavigationGuard(router)
