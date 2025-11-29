# 代码规范

## TypeScript 规范

### 1. 类型定义

#### 优先使用 interface 定义对象类型

```typescript
// ✅ 推荐
interface User {
  id: number
  name: string
  email: string
}

// ❌ 避免
interface User {
  id: number
  name: string
  email: string
}
```

#### 为函数参数和返回值添加类型

```typescript
// ✅ 推荐
function fetchUser(id: number): Promise<User> {
  return request<User>({
    url: `/api/user/${id}`,
    method: "get"
  })
}

// ❌ 避免
function fetchUser(id) {
  return request({
    url: `/api/user/${id}`,
    method: "get"
  })
}
```

#### API 类型定义规范

```typescript
// apis/type.ts
/** 请求参数 */
export interface LoginRequestData {
  Account: string
  Password: string
  captchaVerifyParam: string
}

/** 响应数据 */
export type LoginResponseData = ApiResponseData<{
  Guid: string
}>
```

### 2. 命名规范

| 类型          | 规范             | 示例                               |
| ------------- | ---------------- | ---------------------------------- |
| 文件名 (组件) | PascalCase       | `NavBar.vue`, `UserList.vue`       |
| 文件名 (工具) | kebab-case       | `datetime.ts`, `validate.ts`       |
| 文件名 (页面) | index.vue        | `pages/login/index.vue`            |
| 变量          | camelCase        | `userName`, `activityList`         |
| 常量          | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRY_COUNT`  |
| 类型/接口     | PascalCase       | `User`, `ActivityItem`             |
| 函数          | camelCase        | `fetchData`, `handleSubmit`        |
| 组件名        | PascalCase       | `NavBar`, `UserList`               |
| Props         | camelCase        | `userName`, `maxCount`             |
| 事件          | kebab-case       | `update:model-value`, `item-click` |

### 3. 注释规范

#### JSDoc 注释

```typescript
/**
 * 获取活动列表
 * @param params 查询参数
 * @returns 活动列表数据
 */
export function getActivityListApi(params: ActivityListParams) {
  return request<ActivityListResponse>({
    url: "/Api/H5Api.Activity.GetActivityList",
    method: "post",
    data: params
  })
}
```

#### 单行注释

```typescript
// 获取用户 session
const session = getH5SiteSession()

// 处理活动列表数据
function processActivityList(list: ActivityItem[]) {
  // 过滤已取消的活动
  return list.filter(item => item.ActStatus !== 6)
}
```

## Vue 组件规范

### 1. 使用 Composition API + script setup

```vue
<script setup lang="ts">
import type { ActivityItem } from "./apis/type"
import { getActivityListApi } from "./apis"

// Props 定义
interface Props {
  spaceId?: number
  fieldId?: number
}

const props = withDefaults(defineProps<Props>(), {
  spaceId: 0,
  fieldId: 0
})

const emit = defineEmits<Emits>()

// Emits 定义
interface Emits {
  (e: "update:modelValue", value: string): void
  (e: "itemClick", item: ActivityItem): void
}

// 响应式数据
const loading = ref(false)
const activityList = ref<ActivityItem[]>([])

// 计算属性
const filteredList = computed(() => {
  return activityList.value.filter(item => item.ActStatus === 3)
})

// 方法
async function fetchData() {
  try {
    loading.value = true
    const res = await getActivityListApi({
      SpaceId: props.spaceId,
      FieldId: props.fieldId
      // ... 其他参数
    })
    activityList.value = res.list
  } catch (error) {
    showToast("获取数据失败")
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="activity-list">
    <van-loading v-if="loading" />
    <div v-else>
      <div
        v-for="item in filteredList"
        :key="item.Id"
        class="activity-item"
        @click="emit('itemClick', item)"
      >
        {{ item.ActName }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-list {
  padding: 16px;
}

.activity-item {
  padding: 12px;
  margin-bottom: 8px;
  background: #fff;
  border-radius: 8px;
}
</style>
```

### 2. 组件顺序

```vue
<script setup lang="ts">
// 1. 导入
import type { ... }
import { ... }

// 2. Props 和 Emits 定义
const props = defineProps<...>()
const emit = defineEmits<...>()

// 3. 组合式函数
const router = useRouter()
const route = useRoute()

// 4. 响应式数据
const loading = ref(false)
const form = reactive({ ... })

// 5. 计算属性
const computedValue = computed(() => ...)

// 6. 侦听器
watch(() => props.value, () => { ... })

// 7. 方法
const handleSubmit = () => { ... }

// 8. 生命周期钩子
onMounted(() => { ... })
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 样式 */
</style>
```

### 3. 模板规范

#### 使用 v-for 时必须添加 key

```vue
<!-- ✅ 推荐 -->
<div v-for="item in list" :key="item.id">
  {{ item.name }}
</div>

<!-- ❌ 避免 -->
<div v-for="item in list">
  {{ item.name }}
</div>
```

#### 避免 v-if 和 v-for 同时使用

```vue
<!-- ✅ 推荐 -->
<template v-for="item in list" :key="item.id">
  <div v-if="item.isVisible">
    {{ item.name }}
  </div>
</template>

<!-- ❌ 避免 -->
<div v-for="item in list" v-if="item.isVisible" :key="item.id">
  {{ item.name }}
</div>
```

#### 事件处理器使用方法引用或箭头函数

```vue
<!-- ✅ 推荐 -->
<button @click="handleClick">
点击
</button>

<button @click="() => handleClick(item)">
点击
</button>

<!-- ❌ 避免 -->
<button @click="handleClick()">
点击
</button>
```

## Pinia Store 规范

```typescript
import { defineStore } from "pinia"
import { pinia } from "@/pinia"

export const useActivityStore = defineStore("activity", () => {
  // State
  const activityList = ref<ActivityItem[]>([])
  const currentActivity = ref<ActivityItem | null>(null)

  // Getters (使用 computed)
  const activeActivities = computed(() => {
    return activityList.value.filter(item => item.ActStatus === 3)
  })

  // Actions (使用普通函数)
  const fetchActivityList = async () => {
    try {
      const res = await getActivityListApi({ /* ... */ })
      activityList.value = res.list
    } catch (error) {
      console.error("获取活动列表失败", error)
    }
  }

  const setCurrentActivity = (activity: ActivityItem) => {
    currentActivity.value = activity
  }

  const clearActivityList = () => {
    activityList.value = []
  }

  return {
    // State
    activityList,
    currentActivity,
    // Getters
    activeActivities,
    // Actions
    fetchActivityList,
    setCurrentActivity,
    clearActivityList
  }
})

/**
 * 在 setup 外使用
 */
export function useActivityStoreOutside() {
  return useActivityStore(pinia)
}
```

## 样式规范

### 1. 使用 UnoCSS 原子化类名

```vue
<template>
  <!-- 推荐：使用 UnoCSS -->
  <div class="flex items-center justify-between p-4 mb-2 bg-white rounded-lg">
    <span class="text-base font-bold text-gray-800">标题</span>
    <button class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
      按钮
    </button>
  </div>
</template>
```

### 2. Scoped 样式

```vue
<style scoped>
/* 组件特定样式使用 scoped */
.activity-item {
  /* 自定义样式 */
}

/* 深度选择器 */
:deep(.van-button) {
  border-radius: 8px;
}
</style>
```

### 3. 全局样式

```css
/* common/assets/styles/variables.css */
:root {
  --primary-color: #1989fa;
  --text-color: #323233;
  --border-color: #ebedf0;
  --background-color: #f7f8fa;
}

```

## 工具函数规范

### 1. 纯函数优先

```typescript
// ✅ 推荐：纯函数
export function formatDate(date: string, format: string): string {
  return dayjs(date).format(format)
}

// ❌ 避免：依赖外部状态
let cachedDate = ""
export function formatDate(date: string): string {
  cachedDate = date
  return dayjs(cachedDate).format("YYYY-MM-DD")
}
```

### 2. 参数验证

```typescript
export function formatDate(date: string, format = "YYYY-MM-DD"): string {
  if (!date) {
    console.warn("formatDate: date 参数不能为空")
    return ""
  }
  return dayjs(date).format(format)
}
```

### 3. 错误处理

```typescript
export function parseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.error("JSON 解析失败", error)
    return null
  }
}
```

## 路由规范

### 1. 路由配置

```typescript
{
  path: "/activity/list",
  component: () => import("@/pages/activity/list/index.vue"),
  name: "ActivityList",
  meta: {
    title: "活动列表",
    keepAlive: true,
    layout: {
      navBar: {
        showNavBar: true,
        showLeftArrow: true
      },
      tabbar: {
        showTabbar: false
      }
    }
  }
}
```

### 2. 路由跳转

```typescript
// 编程式导航
router.push({ name: "ActivityDetail", params: { id: "123" } })
router.push({ path: "/activity/detail", query: { id: "123" } })

// 替换当前路由
router.replace({ name: "Login" })

// 返回
router.back()
router.go(-1)
```

## 错误处理规范

### 1. Try-Catch

```typescript
async function fetchData() {
  try {
    loading.value = true
    const res = await getActivityListApi({ /* ... */ })
    activityList.value = res.list
  } catch (error) {
    console.error("获取数据失败", error)
    showToast("获取数据失败，请稍后重试")
  } finally {
    loading.value = false
  }
}
```

### 2. 统一错误提示

```typescript
import { showDialog, showToast } from "vant"

// 轻提示
showToast("操作成功")

// 弹窗提示
showDialog({
  title: "提示",
  message: "确定要删除吗？"
})
```

## 性能优化建议

1. **懒加载路由组件**: 使用动态 import
2. **使用 v-show vs v-if**: 频繁切换用 v-show，条件渲染用 v-if
3. **列表优化**: 使用虚拟滚动 (数据量大时)
4. **图片懒加载**: 使用 Vant 的 Lazyload 指令
5. **防抖节流**: 搜索、滚动等场景使用 lodash-es 的 debounce/throttle
6. **缓存页面**: 使用 keep-alive 和路由 meta.keepAlive

## 安全规范

1. **XSS 防护**: 避免使用 v-html，必要时使用 DOMPurify
2. **敏感信息**: 不在前端存储敏感信息 (密码、token 等)
3. **HTTPS**: 生产环境必须使用 HTTPS
4. **CSRF**: 接口使用 session 认证，防止 CSRF 攻击
