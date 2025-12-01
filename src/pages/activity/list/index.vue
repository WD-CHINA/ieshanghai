<script setup lang="ts">
import type { ActivityItem } from "./apis/type"
import { getActivityStatusTagType } from "@@/utils/vant-helper"
import dayjs from "dayjs"
import { getActivityListApi } from "./apis"
import ActivityFormDialog from "./components/ActivityFormDialog.vue"
import FilterDialog from "./components/FilterDialog.vue"

const router = useRouter()

// 列表数据
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const list = ref<ActivityItem[]>([])
const page = ref(1)
const limit = 20

// 筛选条件
const keyword = ref("")
const filters = reactive({
  SpaceId: 0,
  FieldId: 0,
  PlaceId: 0,
  ServiceType: 0,
  CanBook: 0,
  BeginTime: "",
  EndTime: ""
})

// 筛选弹窗
const showFilterDialog = ref(false)

// 表单弹窗
const showFormDialog = ref(false)
const formDialogMode = ref<"add" | "edit" | "view">("add")
const formDialogData = ref<ActivityItem | null>(null)

// 计算是否有筛选条件
const hasActiveFilters = computed(() => {
  return filters.FieldId !== 0
    || filters.PlaceId !== 0
    || filters.ServiceType !== 0
    || filters.CanBook !== 0
    || filters.BeginTime !== ""
    || filters.EndTime !== ""
})

// 获取活动列表
async function fetchActivityList(reset = false) {
  if (loading.value) return

  try {
    loading.value = true
    if (reset) {
      page.value = 1
      list.value = []
      finished.value = false
    }

    const { Data } = await getActivityListApi({
      SpaceId: filters.SpaceId,
      FieldId: filters.FieldId,
      PlaceId: filters.PlaceId,
      ServiceType: filters.ServiceType,
      CanBook: filters.CanBook,
      Keyword: keyword.value,
      BeginTime: filters.BeginTime || dayjs().format("YYYY-MM-DD"),
      EndTime: filters.EndTime || dayjs().add(30, "day").format("YYYY-MM-DD"),
      page: page.value,
      limit
    })

    if (Data) {
      if (reset) {
        list.value = Data.list || []
      } else {
        list.value.push(...(Data.list || []))
      }

      if (Data.list && Data.list.length < limit) {
        finished.value = true
      } else {
        page.value++
      }
    }
  } catch (error: any) {
    console.error("获取活动列表失败", error)
    showToast(error.Message || "获取活动列表失败")
    finished.value = true
  } finally {
    loading.value = false
  }
}

// 下拉刷新
async function onRefresh() {
  refreshing.value = true
  await fetchActivityList(true)
  refreshing.value = false
}

// 加载更多
function onLoad() {
  fetchActivityList()
}

// 搜索
function handleSearch() {
  onRefresh()
}

// 打开筛选弹窗
function openFilterDialog() {
  showFilterDialog.value = true
}

// 筛选确认
function handleFilterConfirm(newFilters: typeof filters) {
  Object.assign(filters, newFilters)
  onRefresh()
}

// 重置筛选
function handleFilterReset() {
  filters.SpaceId = 0
  filters.FieldId = 0
  filters.PlaceId = 0
  filters.ServiceType = 0
  filters.CanBook = 0
  filters.BeginTime = ""
  filters.EndTime = ""
  onRefresh()
}

// 打开新增弹窗
function openSubmitDialog() {
  formDialogMode.value = "add"
  formDialogData.value = null
  showFormDialog.value = true
}

// 查看详情
function handleDetail(item: ActivityItem) {
  formDialogMode.value = "view"
  formDialogData.value = item
  showFormDialog.value = true
}

// 编辑
function handleEdit(item: ActivityItem) {
  formDialogMode.value = "edit"
  formDialogData.value = item
  showFormDialog.value = true
}

// 预约详情
function handleBooking(item: ActivityItem) {
  router.push({
    path: "/activity/booking",
    query: { activityId: item.Id.toString() }
  })
}

// 表单提交成功回调
function handleFormSubmit() {
  showFormDialog.value = false
  onRefresh()
}

// 判断是否可以编辑（仅未开始的活动可编辑）
function canEdit(item: ActivityItem): boolean {
  const now = dayjs()
  const beginTime = dayjs(item.BeginDateTime)
  return beginTime.isAfter(now)
}

// 初始化
onMounted(() => {
  onRefresh()
})
</script>

<script lang="ts">
export default {
  name: "ActivityList"
}
</script>

<template>
  <div
    un-min-h-screen
    un-bg-gray-50
    un-pb="[env(safe-area-inset-bottom)]"
  >
    <!-- 导航栏 -->
    <van-nav-bar
      title="活动排期"
      left-arrow
      fixed
      placeholder
      @click-left="router.back()"
    >
      <template #right>
        <div un-flex un-items-center un-gap-3>
          <van-icon
            name="filter-o"
            size="20"
            :un-text-blue-500="hasActiveFilters"
            @click="openFilterDialog"
          />
          <van-icon
            name="plus"
            size="20"
            @click="openSubmitDialog"
          />
        </div>
      </template>
    </van-nav-bar>

    <!-- 搜索栏 -->
    <div un-px-4 un-pt-4 un-pb-2 un-bg-white>
      <van-search
        v-model="keyword"
        placeholder="搜索活动名称"
        shape="round"
        @search="handleSearch"
      />
    </div>

    <!-- 筛选标签显示 -->
    <div
      v-if="hasActiveFilters"
      un-px-4
      un-py-2
      un-bg-white
      un-border-b
      un-border-gray-100
    >
      <div un-flex un-flex-wrap un-gap-2>
        <van-tag
          v-if="filters.PlaceId !== 0"
          closeable
          type="primary"
          @close="filters.PlaceId = 0; onRefresh()"
        >
          场地已选
        </van-tag>
        <van-tag
          v-if="filters.ServiceType !== 0"
          closeable
          type="primary"
          @close="filters.ServiceType = 0; onRefresh()"
        >
          服务类型已选
        </van-tag>
        <van-tag
          v-if="filters.CanBook !== 0"
          closeable
          type="primary"
          @close="filters.CanBook = 0; onRefresh()"
        >
          {{ filters.CanBook === 1 ? '预约活动' : filters.CanBook === 2 ? '常规活动' : '团队活动' }}
        </van-tag>
        <van-tag
          v-if="filters.BeginTime"
          closeable
          type="primary"
          @close="filters.BeginTime = ''; onRefresh()"
        >
          开始: {{ filters.BeginTime }}
        </van-tag>
        <van-tag
          v-if="filters.EndTime"
          closeable
          type="primary"
          @close="filters.EndTime = ''; onRefresh()"
        >
          结束: {{ filters.EndTime }}
        </van-tag>
      </div>
    </div>

    <!-- 列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div un-px-4 un-py-2 un-space-y-3>
          <div
            v-for="item in list"
            :key="item.Id"
            un-bg-white
            un-rounded-xl
            un-p-4
            un-shadow-sm
            @click="handleDetail(item)"
          >
            <!-- 头部：活动名称和状态 -->
            <div un-flex un-items-start un-justify-between un-mb-3>
              <div un-flex-1>
                <h3 un-text-base un-font-bold un-text-gray-800 un-mb-1>
                  {{ item.ActName }}
                </h3>
                <div un-text-sm un-text-gray-500>
                  {{ item.PlaceName }}
                </div>
              </div>
              <van-tag
                :type="getActivityStatusTagType(item.ActStatus)"
                size="medium"
                round
              >
                {{ item.ActStatusName }}
              </van-tag>
            </div>

            <!-- 活动信息 -->
            <div un-space-y="1.5" un-text-sm un-text-gray-600 un-mb-3>
              <div un-flex un-items-center>
                <van-icon name="clock-o" un-mr="1.5" />
                <span>{{ item.ActTime }}</span>
              </div>
              <div un-flex un-items-center>
                <van-icon name="location-o" un-mr="1.5" />
                <span>{{ item.ServiceTypeName }}</span>
              </div>
              <div
                v-if="item.CanBook === 1"
                un-flex
                un-items-center
              >
                <van-icon name="friends-o" un-mr="1.5" />
                <span>已预约: {{ item.BookedQty }} / {{ item.CanBookQty }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div un-flex un-gap-2 un-pt-3 un-border-t un-border-gray-100>
              <van-button
                v-if="canEdit(item)"
                size="small"
                type="primary"
                plain
                round
                @click.stop="handleEdit(item)"
              >
                编辑
              </van-button>
              <van-button
                v-if="item.CanBook === 1"
                size="small"
                type="success"
                plain
                round
                @click.stop="handleBooking(item)"
              >
                预约详情
              </van-button>
            </div>
          </div>

          <!-- 空状态 -->
          <van-empty
            v-if="!loading && list.length === 0"
            description="暂无活动排期"
            un-py-10
          />
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 筛选弹窗 -->
    <FilterDialog
      v-model:show="showFilterDialog"
      :filters="filters"
      @confirm="handleFilterConfirm"
      @reset="handleFilterReset"
    />

    <!-- 新增/编辑/查看活动排期弹窗 -->
    <ActivityFormDialog
      v-model:show="showFormDialog"
      :mode="formDialogMode"
      :initial-data="formDialogData"
      @submit="handleFormSubmit"
      @cancel="showFormDialog = false"
    />
  </div>
</template>
