import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export interface RouteMap {
  [key: string]: RouteRecordRaw[]
}

const modules = import.meta.glob('../views/**/*.vue', { eager: true })
// 存储所有路由
const routes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/main',
  },
  {
    name: 'MAIN',
    path: '/main',
    component: () => import('@/views/main/index.vue'),
    children: [],
  },
  {
    name: 'OTHER',
    path: '/other',
    component: () => import('@/views/other/index.vue'),
    children: [],
  },
]
/**
 * 存放路由信息
 * 格式为 { 一级路由名字: 对应的子路由数组 }
 */
const routeMap: RouteMap = {}
// 无需自动注册的路由
const noAuto = ['../views/main/index.vue', '../views/other/index.vue']
// 无需识别为路由的文件夹名字
const noRecognition = ['component']

export const importRoute = () => {
  Object.keys(modules)
    .filter((key) => {
      // 找到路由的父级路由
      const fatherRoute = key.replace('../views/', '').split('/')[0]
      // 找到该路由的名字
      const arr = key.replace(`../views/${fatherRoute}/`, '').split('/')
      return !noAuto.includes(key) && arr.length === 2
    })
    .forEach((fileKey) => {
      // 找到路由的父级路由
      const fatherRoute = fileKey.replace('../views/', '').split('/')[0]
      // 找到该路由的名字
      const originName = fileKey
        .replace(`../views/${fatherRoute}/`, '')
        .split('/')[0]
      routeMap[fatherRoute] = routeMap[fatherRoute] || []
      routeMap[fatherRoute].push({
        name: `${fatherRoute.toUpperCase()}_${originName.toUpperCase()}`,
        path: originName,
        component: () => import(fileKey),
      })
    })

  for (const key in routeMap) {
    const route = routes.find((item) => item.name === key.toUpperCase())
    if (route) {
      route.children = routeMap[key]
      route.redirect = `${route.path}/${routeMap[key][0].path}`
    }
  }
}

importRoute()
// console.log('routes -->', routes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
