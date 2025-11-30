<script setup lang="ts">
import type { ActivityItem } from "./apis/type"
import { getActivityStatusTagType } from "@@/utils/vant-helper"
import dayjs from "dayjs"
import { getActivityListApi } from "./apis"
import ActivityFormDialog from "./components/ActivityFormDialog.vue"

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
const filterBeginTime = ref("")
const filterEndTime = ref("")
const filterBeginTimeArray = ref<string[]>([])
const filterEndTimeArray = ref<string[]>([])
const showFilterBeginTimePicker = ref(false)
const showFilterEndTimePicker = ref(false)

// 表单弹窗
const showFormDialog = ref(false)
const formDialogMode = ref<"add" | "edit" | "view">("add")
const formDialogData = ref<ActivityItem | null>(null)

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
      SpaceId: 0,
      FieldId: 0,
      PlaceId: 0,
      ServiceType: 0,
      CanBook: 0,
      Keyword: keyword.value,
      BeginTime: filterBeginTime.value || dayjs().format("YYYY-MM-DD"),
      EndTime: filterEndTime.value || dayjs().add(30, "day").format("YYYY-MM-DD"),
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

// 日期选择确认
function handleFilterBeginTimeConfirm(value: any) {
  filterBeginTime.value = value.selectedValues.join("-")
  showFilterBeginTimePicker.value = false
  onRefresh()
}

function handleFilterEndTimeConfirm(value: any) {
  filterEndTime.value = value.selectedValues.join("-")
  showFilterEndTimePicker.value = false
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
  <div class="activity-list-page min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <van-nav-bar
      title="活动排期"
      left-arrow
      fixed
      placeholder
      @click-left="router.back()"
    >
      <template #right>
        <van-icon
          name="plus"
          size="20"
          @click="openSubmitDialog"
        />
      </template>
    </van-nav-bar>

    <!-- 搜索栏 -->
    <div class="px-4 pt-4 pb-2 bg-white">
      <van-search
        v-model="keyword"
        placeholder="搜索活动名称"
        shape="round"
        @search="handleSearch"
      />
    </div>

    <!-- 筛选条件 -->
    <div class="px-4 py-2 bg-white border-b border-gray-100">
      <div class="flex gap-2">
        <van-button
          size="small"
          plain
          round
          @click="showFilterBeginTimePicker = true"
        >
          {{ filterBeginTime || "开始日期" }}
        </van-button>
        <van-button
          size="small"
          plain
          round
          @click="showFilterEndTimePicker = true"
        >
          {{ filterEndTime || "结束日期" }}
        </van-button>
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
        <div class="px-4 py-2 space-y-3">
          <div
            v-for="item in list"
            :key="item.Id"
            class="bg-white rounded-xl p-4 shadow-sm"
            @click="handleDetail(item)"
          >
            <!-- 头部：活动名称和状态 -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="text-base font-bold text-gray-800 mb-1">
                  {{ item.ActName }}
                </h3>
                <div class="text-sm text-gray-500">
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
            <div class="space-y-1.5 text-sm text-gray-600 mb-3">
              <div class="flex items-center">
                <van-icon name="clock-o" class="mr-1.5" />
                <span>{{ item.ActTime }}</span>
              </div>
              <div class="flex items-center">
                <van-icon name="location-o" class="mr-1.5" />
                <span>{{ item.ServiceTypeName }}</span>
              </div>
              <div v-if="item.CanBook === 1" class="flex items-center">
                <van-icon name="friends-o" class="mr-1.5" />
                <span>已预约: {{ item.BookedQty }} / {{ item.CanBookQty }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-2 pt-3 border-t border-gray-100">
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
            class="py-10"
          />
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showFilterBeginTimePicker" position="bottom" round>
      <van-date-picker
        v-model="filterBeginTimeArray"
        title="选择开始日期"
        @confirm="handleFilterBeginTimeConfirm"
        @cancel="showFilterBeginTimePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showFilterEndTimePicker" position="bottom" round>
      <van-date-picker
        v-model="filterEndTimeArray"
        title="选择结束日期"
        @confirm="handleFilterEndTimeConfirm"
        @cancel="showFilterEndTimePicker = false"
      />
    </van-popup>

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

<style scoped>
.activity-list-page {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
