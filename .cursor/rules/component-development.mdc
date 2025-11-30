# 组件开发规范

## Vant 组件库使用

项目使用 **Vant 4.x** 作为移动端 UI 组件库，支持自动按需导入。

### 常用组件

| 组件                  | 用途                          | 文档                                                                     |
| --------------------- | ----------------------------- | ------------------------------------------------------------------------ |
| `van-nav-bar`         | 顶部导航栏                    | [NavBar](https://vant-ui.github.io/vant/#/zh-CN/nav-bar)                 |
| `van-tabbar`          | 底部标签栏                    | [Tabbar](https://vant-ui.github.io/vant/#/zh-CN/tabbar)                  |
| `van-form`            | 表单                          | [Form](https://vant-ui.github.io/vant/#/zh-CN/form)                      |
| `van-field`           | 输入框                        | [Field](https://vant-ui.github.io/vant/#/zh-CN/field)                    |
| `van-button`          | 按钮                          | [Button](https://vant-ui.github.io/vant/#/zh-CN/button)                  |
| `van-list`            | 列表 (支持下拉刷新、上拉加载) | [List](https://vant-ui.github.io/vant/#/zh-CN/list)                      |
| `van-pull-refresh`    | 下拉刷新                      | [PullRefresh](https://vant-ui.github.io/vant/#/zh-CN/pull-refresh)       |
| `van-picker`          | 选择器                        | [Picker](https://vant-ui.github.io/vant/#/zh-CN/picker)                  |
| `van-datetime-picker` | 日期时间选择器                | [DatetimePicker](https://vant-ui.github.io/vant/#/zh-CN/datetime-picker) |
| `van-popup`           | 弹出层                        | [Popup](https://vant-ui.github.io/vant/#/zh-CN/popup)                    |
| `van-dialog`          | 弹窗                          | [Dialog](https://vant-ui.github.io/vant/#/zh-CN/dialog)                  |
| `van-toast`           | 轻提示                        | [Toast](https://vant-ui.github.io/vant/#/zh-CN/toast)                    |
| `van-loading`         | 加载                          | [Loading](https://vant-ui.github.io/vant/#/zh-CN/loading)                |
| `van-empty`           | 空状态                        | [Empty](https://vant-ui.github.io/vant/#/zh-CN/empty)                    |
| `van-uploader`        | 文件上传                      | [Uploader](https://vant-ui.github.io/vant/#/zh-CN/uploader)              |
| `van-image`           | 图片 (支持懒加载)             | [Image](https://vant-ui.github.io/vant/#/zh-CN/image)                    |
| `van-search`          | 搜索框                        | [Search](https://vant-ui.github.io/vant/#/zh-CN/search)                  |
| `van-tabs`            | 标签页                        | [Tabs](https://vant-ui.github.io/vant/#/zh-CN/tabs)                      |

## 页面开发模板

### 1. 列表页

```vue
<script setup lang="ts">
import type { ActivityItem } from "./apis/type"
import { getActivityListApi } from "./apis"

// 加载状态
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)

// 列表数据
const list = ref<ActivityItem[]>([])
const queryParams = reactive({
  page: 1,
  limit: 20,
  keyword: "",
  beginTime: "",
  endTime: ""
})

// 搜索关键词
const searchValue = ref("")

// 加载列表
async function onLoad() {
  try {
    const res = await getActivityListApi({
      ...queryParams,
      page: queryParams.page
    })

    if (queryParams.page === 1) {
      list.value = res.list
    } else {
      list.value.push(...res.list)
    }

    // 判断是否加载完成
    if (list.value.length >= res.count) {
      finished.value = true
    } else {
      queryParams.page++
    }
  } catch (error) {
    showToast("加载失败")
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 搜索
function onSearch() {
  queryParams.keyword = searchValue.value
  queryParams.page = 1
  finished.value = false
  list.value = []
  onLoad()
}

// 下拉刷新
function onRefresh() {
  queryParams.page = 1
  finished.value = false
  list.value = []
  onLoad()
}

// 跳转详情
const router = useRouter()
function handleItemClick(item: ActivityItem) {
  router.push({
    name: "ActivityDetail",
    params: { id: item.Id }
  })
}

// 初始化加载
onMounted(() => {
  onLoad()
})
</script>

<template>
  <div class="activity-list-page">
    <!-- 搜索栏 -->
    <van-search
      v-model="searchValue"
      placeholder="搜索活动名称"
      @search="onSearch"
    />

    <!-- 列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="item in list"
          :key="item.Id"
          class="activity-item"
          @click="handleItemClick(item)"
        >
          <div class="activity-name">
            {{ item.ActName }}
          </div>
          <div class="activity-time">
            {{ item.ActTime }}
          </div>
          <div class="activity-place">
            {{ item.PlaceName }}
          </div>
        </div>
      </van-list>

      <!-- 空状态 -->
      <van-empty v-if="!loading && list.length === 0" description="暂无数据" />
    </van-pull-refresh>
  </div>
</template>

<style scoped>
.activity-list-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.activity-item {
  padding: 16px;
  margin: 8px 16px;
  background: white;
  border-radius: 8px;
}

.activity-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.activity-time,
.activity-place {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}
</style>
```

### 2. 详情页

```vue
<script setup lang="ts">
import type { ActivityDetail } from "./apis/type"
import { getActivityDetailApi } from "./apis"

const route = useRoute()
const router = useRouter()
const activityId = computed(() => Number(route.params.id))

// 详情数据
const loading = ref(false)
const detail = ref<ActivityDetail>()

// 加载详情
async function fetchDetail() {
  try {
    loading.value = true
    const res = await getActivityDetailApi({ Id: activityId.value })
    detail.value = res
  } catch (error) {
    showToast("加载失败")
  } finally {
    loading.value = false
  }
}

// 编辑
function handleEdit() {
  router.push({
    name: "ActivityEdit",
    params: { id: activityId.value }
  })
}

// 返回
function handleBack() {
  router.back()
}

onMounted(() => {
  fetchDetail()
})
</script>

<template>
  <div class="activity-detail-page">
    <!-- 导航栏 -->
    <van-nav-bar
      title="活动详情"
      left-arrow
      @click-left="handleBack"
    >
      <template #right>
        <van-button size="small" type="primary" @click="handleEdit">
          编辑
        </van-button>
      </template>
    </van-nav-bar>

    <!-- 加载中 -->
    <van-loading v-if="loading" class="loading" />

    <!-- 详情内容 -->
    <div v-else-if="detail" class="detail-content">
      <div class="detail-item">
        <div class="label">
          活动名称
        </div>
        <div class="value">
          {{ detail.ActName }}
        </div>
      </div>

      <div class="detail-item">
        <div class="label">
          活动时间
        </div>
        <div class="value">
          {{ detail.ActTime }}
        </div>
      </div>

      <div class="detail-item">
        <div class="label">
          活动场地
        </div>
        <div class="value">
          {{ detail.PlaceName }}
        </div>
      </div>

      <div class="detail-item">
        <div class="label">
          活动简介
        </div>
        <div class="value">
          {{ detail.Brief }}
        </div>
      </div>

      <!-- 活动图片 -->
      <div v-if="detail.ImgUrl" class="detail-item">
        <div class="label">
          活动图片
        </div>
        <van-image
          :src="detail.ImgUrl"
          fit="cover"
          class="activity-image"
        />
      </div>

      <!-- 预约信息 -->
      <div v-if="detail.CanBook === 1" class="booking-info">
        <div class="detail-item">
          <div class="label">
            可预约人数
          </div>
          <div class="value">
            {{ detail.CanBookQty }}
          </div>
        </div>

        <div class="detail-item">
          <div class="label">
            已预约人数
          </div>
          <div class="value">
            {{ detail.BookedQty }}
          </div>
        </div>

        <div class="detail-item">
          <div class="label">
            预约时间
          </div>
          <div class="value">
            {{ detail.BookBeginTime }} ~ {{ detail.BookEndTime }}
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <van-empty v-else description="暂无数据" />
  </div>
</template>

<style scoped>
.activity-detail-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
}

.detail-content {
  padding: 16px;
}

.detail-item {
  margin-bottom: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.value {
  font-size: 16px;
  color: #323233;
}

.activity-image {
  width: 100%;
  border-radius: 8px;
  margin-top: 8px;
}

.booking-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebedf0;
}
</style>
```

### 3. 表单页

```vue
<script setup lang="ts">
import type { SubmitActivityRequestData } from "./apis/type"
import { submitActivityApi } from "./apis"

const route = useRoute()
const router = useRouter()
const activityId = computed(() => Number(route.params.id) || 0)

// 表单数据
const form = reactive<SubmitActivityRequestData>({
  Id: activityId.value,
  ActName: "",
  ActNameEn: "",
  ServiceType: 0,
  PlaceId: 0,
  BeginTime: "",
  EndTime: "",
  LengthMinutes: 0,
  ExpectPeople: 0,
  Brief: "",
  BriefEn: "",
  CanBook: 2, // 默认常规活动
  CanBookQty: 0,
  UserCanBookQty: 0,
  BookBeginTime: "",
  BookEndTime: "",
  BookComment: "",
  ListImg: "",
  ShowImg: ""
})

// 提交状态
const submitting = ref(false)

// 场地列表
const placeList = ref([])
const showPlacePicker = ref(false)

// 日期时间选择
const showTimePicker = ref(false)
const currentTimeField = ref<"begin" | "end">()

// 选择场地
function onSelectPlace(place: any) {
  form.PlaceId = place.Id
  showPlacePicker.value = false
}

// 选择时间
function onSelectTime(value: Date) {
  const dateTime = dayjs(value).format("YYYY-MM-DD HH:mm:ss")
  if (currentTimeField.value === "begin") {
    form.BeginTime = dateTime
  } else {
    form.EndTime = dateTime
  }
  showTimePicker.value = false
}

// 图片上传
async function onUploadImage(file: File, field: "ListImg" | "ShowImg") {
  try {
    const formData = new FormData()
    formData.append("file", file)
    // 调用图片上传接口
    // const res = await uploadImageApi(formData)
    // form[field] = res.FileName
    showToast("图片上传成功")
  } catch (error) {
    showToast("图片上传失败")
  }
}

// 表单验证
function validateForm(): boolean {
  if (!form.ActName) {
    showToast("请输入活动名称")
    return false
  }
  if (!form.PlaceId) {
    showToast("请选择场地")
    return false
  }
  if (!form.BeginTime || !form.EndTime) {
    showToast("请选择活动时间")
    return false
  }
  if (form.CanBook === 1) {
    if (!form.CanBookQty) {
      showToast("请输入可预约人数")
      return false
    }
    if (!form.BookBeginTime || !form.BookEndTime) {
      showToast("请选择预约时间")
      return false
    }
  }
  return true
}

// 提交表单
async function handleSubmit() {
  if (!validateForm()) return

  try {
    submitting.value = true
    await submitActivityApi(form)
    showToast("提交成功")
    router.back()
  } catch (error: any) {
    showToast(error.Message || "提交失败")
  } finally {
    submitting.value = false
  }
}

// 返回
function handleBack() {
  router.back()
}
</script>

<template>
  <div class="activity-form-page">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="activityId ? '编辑活动' : '新增活动'"
      left-arrow
      @click-left="handleBack"
    />

    <!-- 表单 -->
    <van-form @submit="handleSubmit">
      <van-cell-group inset>
        <!-- 活动名称 -->
        <van-field
          v-model="form.ActName"
          label="活动名称"
          placeholder="请输入活动名称"
          required
        />

        <!-- 场地选择 -->
        <van-field
          :model-value="placeList.find(p => p.Id === form.PlaceId)?.Name"
          label="活动场地"
          placeholder="请选择场地"
          required
          readonly
          is-link
          @click="showPlacePicker = true"
        />

        <!-- 活动时间 -->
        <van-field
          v-model="form.BeginTime"
          label="开始时间"
          placeholder="请选择开始时间"
          required
          readonly
          is-link
          @click="currentTimeField = 'begin'; showTimePicker = true"
        />

        <van-field
          v-model="form.EndTime"
          label="结束时间"
          placeholder="请选择结束时间"
          required
          readonly
          is-link
          @click="currentTimeField = 'end'; showTimePicker = true"
        />

        <!-- 预计参与人数 -->
        <van-field
          v-model.number="form.ExpectPeople"
          label="预计人数"
          type="number"
          placeholder="请输入预计参与人数"
          required
        />

        <!-- 活动简介 -->
        <van-field
          v-model="form.Brief"
          label="活动简介"
          type="textarea"
          rows="3"
          placeholder="请输入活动简介"
          required
        />

        <!-- 活动类型 -->
        <van-field label="活动类型">
          <template #input>
            <van-radio-group v-model="form.CanBook" direction="horizontal">
              <van-radio :name="2">
                常规活动
              </van-radio>
              <van-radio :name="1">
                预约活动
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <!-- 预约设置 (仅预约活动) -->
        <template v-if="form.CanBook === 1">
          <van-field
            v-model.number="form.CanBookQty"
            label="可预约人数"
            type="number"
            placeholder="请输入可预约人数"
            required
          />

          <van-field
            v-model="form.BookBeginTime"
            label="预约开始"
            placeholder="请选择预约开始时间"
            required
            readonly
            is-link
          />

          <van-field
            v-model="form.BookEndTime"
            label="预约结束"
            placeholder="请选择预约结束时间"
            required
            readonly
            is-link
          />
        </template>

        <!-- 图片上传 -->
        <van-field label="活动图片">
          <template #input>
            <van-uploader
              :max-count="2"
              @after-read="(file) => onUploadImage(file.file, 'ListImg')"
            />
          </template>
        </van-field>
      </van-cell-group>

      <!-- 提交按钮 -->
      <div class="submit-button">
        <van-button
          type="primary"
          block
          :loading="submitting"
          native-type="submit"
        >
          提交
        </van-button>
      </div>
    </van-form>

    <!-- 场地选择器 -->
    <van-popup v-model:show="showPlacePicker" position="bottom">
      <van-picker
        :columns="placeList"
        :columns-field-names="{ text: 'Name', value: 'Id' }"
        @confirm="onSelectPlace"
        @cancel="showPlacePicker = false"
      />
    </van-popup>

    <!-- 时间选择器 -->
    <van-popup v-model:show="showTimePicker" position="bottom">
      <van-datetime-picker
        type="datetime"
        @confirm="onSelectTime"
        @cancel="showTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<style scoped>
.activity-form-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.submit-button {
  margin: 16px;
}
</style>
```

## 组合式函数 (Composables)

### 1. 列表加载 Composable

```typescript
// common/composables/useList.ts
import type { Ref } from "vue"

interface UseListOptions<T, P> {
  fetchApi: (params: P) => Promise<{ list: T[], count: number }>
  defaultParams: P
}

export function useList<T, P extends { page: number, limit: number }>(
  options: UseListOptions<T, P>
) {
  const loading = ref(false)
  const refreshing = ref(false)
  const finished = ref(false)
  const list: Ref<T[]> = ref([])
  const params = reactive({ ...options.defaultParams })

  const loadData = async () => {
    try {
      const res = await options.fetchApi(params)

      if (params.page === 1) {
        list.value = res.list
      } else {
        list.value.push(...res.list)
      }

      if (list.value.length >= res.count) {
        finished.value = true
      } else {
        params.page++
      }
    } catch (error) {
      console.error("加载数据失败", error)
    } finally {
      loading.value = false
      refreshing.value = false
    }
  }

  const onRefresh = () => {
    params.page = 1
    finished.value = false
    list.value = []
    loadData()
  }

  return {
    loading,
    refreshing,
    finished,
    list,
    params,
    loadData,
    onRefresh
  }
}
```

### 2. 表单提交 Composable

```typescript
// common/composables/useForm.ts
import type { Ref } from "vue"

interface UseFormOptions<T> {
  initialValues: T
  onSubmit: (values: T) => Promise<void>
  validate?: (values: T) => boolean | Promise<boolean>
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
) {
  const form = reactive({ ...options.initialValues })
  const submitting = ref(false)
  const errors: Ref<Partial<Record<keyof T, string>>> = ref({})

  const resetForm = () => {
    Object.assign(form, options.initialValues)
    errors.value = {}
  }

  const handleSubmit = async () => {
    if (options.validate) {
      const isValid = await options.validate(form as T)
      if (!isValid) return
    }

    try {
      submitting.value = true
      await options.onSubmit(form as T)
    } catch (error) {
      console.error("表单提交失败", error)
      throw error
    } finally {
      submitting.value = false
    }
  }

  return {
    form,
    submitting,
    errors,
    resetForm,
    handleSubmit
  }
}
```

## 通用工具组件

### 1. 空状态组件

```vue
<!-- components/Empty.vue -->
<script setup lang="ts">
interface Props {
  image?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  image: "default",
  description: "暂无数据"
})
</script>

<template>
  <van-empty
    :image="image"
    :description="description"
  >
    <slot />
  </van-empty>
</template>
```

### 2. 加载状态组件

```vue
<!-- components/LoadingState.vue -->
<script setup lang="ts">
interface Props {
  loading?: boolean
  text?: string
}

withDefaults(defineProps<Props>(), {
  loading: true,
  text: "加载中..."
})
</script>

<template>
  <div v-if="loading" class="loading-state">
    <van-loading :text="text" />
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
}
</style>
```

## 移动端适配

### 1. 视口配置

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

```

### 2. 1px 边框问题

使用 PostCSS Mobile Forever 插件自动处理。

### 3. 安全区域适配

```css
/* 适配刘海屏 */
.page-content {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

```

## 性能优化

### 1. 图片懒加载

```vue
<van-image
  lazy-load
  :src="imageUrl"
/>
```

### 2. 虚拟列表 (大数据量)

考虑使用 `vant` 的虚拟列表组件或第三方库。

### 3. 路由懒加载

```typescript
{
  path: "/activity/list",
  component: () => import("@/pages/activity/list/index.vue")
}
```
