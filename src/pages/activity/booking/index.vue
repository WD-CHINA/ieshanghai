<script setup lang="ts">
import { getBookingStatusTagType } from "@@/utils/vant-helper"
import { showDialog, showToast } from "vant"

const router = useRouter()

// 预约列表数据
interface BookingItem {
  Id: number
  ContactName: string
  ContactPhone: string
  BookQty: number
  BookTime: string
  BookRemark: string
  Status: number // 0-待审核, 1-已通过, 2-已拒绝, 3-已签到, 4-未参加
  StatusName: string
}

const loading = ref(false)
const list = ref<BookingItem[]>([
  {
    Id: 1,
    ContactName: "张三",
    ContactPhone: "138****1234",
    BookQty: 2,
    BookTime: "2025-11-25 10:30:00",
    BookRemark: "带小孩参加",
    Status: 0,
    StatusName: "待审核"
  },
  {
    Id: 2,
    ContactName: "李四",
    ContactPhone: "139****5678",
    BookQty: 1,
    BookTime: "2025-11-25 11:00:00",
    BookRemark: "",
    Status: 1,
    StatusName: "已通过"
  },
  {
    Id: 3,
    ContactName: "王五",
    ContactPhone: "136****9012",
    BookQty: 3,
    BookTime: "2025-11-25 09:45:00",
    BookRemark: "预约全家参加",
    Status: 1,
    StatusName: "已通过"
  }
])

// 当前选中的预约
const selectedBooking = ref<BookingItem>()
const showDetail = ref(false)

// 统计数据
const statistics = computed(() => {
  const total = list.value.reduce((sum: number, item: BookingItem) => sum + item.BookQty, 0)
  const pending = list.value.filter((item: BookingItem) => item.Status === 0).length
  const approved = list.value.filter((item: BookingItem) => item.Status === 1).length

  return { total, pending, approved }
})

// 获取状态标签类型（使用统一工具函数）
const getStatusType = getBookingStatusTagType

// 查看详情
function handleItemClick(item: BookingItem) {
  selectedBooking.value = item
  showDetail.value = true
}

// 审核
async function handleApprove(approved: boolean) {
  if (!selectedBooking.value) return

  showDialog({
    title: "确认审核",
    message: `确定${approved ? "通过" : "拒绝"}该预约申请吗？`,
    showCancelButton: true
  }).then(async () => {
    showToast("审核成功")
    // TODO: 调用审核接口
    showDetail.value = false
  }).catch(() => {
    // 取消
  })
}

// 返回
function handleBack() {
  router.back()
}

// 加载数据
async function fetchData() {
  loading.value = true
  // TODO: 调用接口获取预约列表
  // const res = await getActivityBookingListApi({ ActivityId: activityId.value })
  // list.value = res.Data?.list || []
  loading.value = false
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="activity-booking-page min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <van-nav-bar
      title="预约情况"
      left-arrow
      fixed
      placeholder
      @click-left="handleBack"
    />

    <!-- 统计卡片 -->
    <div class="mx-4 mt-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold mb-1">
            {{ statistics.total }}
          </div>
          <div class="text-sm opacity-90">
            预约总人数
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold mb-1">
            {{ statistics.pending }}
          </div>
          <div class="text-sm opacity-90">
            待审核
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold mb-1">
            {{ statistics.approved }}
          </div>
          <div class="text-sm opacity-90">
            已通过
          </div>
        </div>
      </div>
    </div>

    <!-- 预约列表 -->
    <div class="mx-4 mt-4 space-y-3 pb-4">
      <div
        v-for="item in list"
        :key="item.Id"
        class="bg-white rounded-xl p-4 shadow-sm"
        @click="handleItemClick(item)"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center mb-1">
              <van-icon name="contact" class="mr-1.5 text-gray-400" />
              <span class="text-base font-bold text-gray-800">{{ item.ContactName }}</span>
            </div>
            <div class="text-sm text-gray-600">
              {{ item.ContactPhone }}
            </div>
          </div>
          <van-tag
            :type="getStatusType(item.Status)"
            size="medium"
            round
          >
            {{ item.StatusName }}
          </van-tag>
        </div>

        <div class="space-y-1.5 text-sm text-gray-600">
          <div class="flex items-center">
            <van-icon name="clock-o" class="mr-1.5" />
            <span>预约时间: {{ item.BookTime }}</span>
          </div>

          <div class="flex items-center">
            <van-icon name="friends-o" class="mr-1.5" />
            <span>预约人数: {{ item.BookQty }} 人</span>
          </div>

          <div v-if="item.BookRemark" class="flex items-start">
            <van-icon name="comment-o" class="mr-1.5 mt-0.5" />
            <span class="flex-1">备注: {{ item.BookRemark }}</span>
          </div>
        </div>

        <div v-if="item.Status === 0" class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <van-button
            size="small"
            type="success"
            plain
            round
            block
            @click.stop="handleItemClick(item)"
          >
            立即审核
          </van-button>
        </div>
      </div>

      <!-- 空状态 -->
      <van-empty
        v-if="!loading && list.length === 0"
        description="暂无预约记录"
        class="py-10"
      />
    </div>

    <!-- 预约详情弹窗 -->
    <van-popup
      v-model:show="showDetail"
      round
      position="bottom"
      :style="{ maxHeight: '80%' }"
    >
      <div v-if="selectedBooking" class="p-6">
        <div class="text-center mb-6">
          <h3 class="text-lg font-bold text-gray-800 mb-2">
            预约详情
          </h3>
          <van-tag
            :type="getStatusType(selectedBooking.Status)"
            size="large"
            round
          >
            {{ selectedBooking.StatusName }}
          </van-tag>
        </div>

        <van-cell-group :border="false" class="!bg-gray-50 rounded-xl">
          <van-cell
            title="联系人"
            :value="selectedBooking.ContactName"
            :border="false"
          />
          <van-cell
            title="联系电话"
            :value="selectedBooking.ContactPhone"
            :border="false"
          />
          <van-cell
            title="预约人数"
            :value="`${selectedBooking.BookQty} 人`"
            :border="false"
          />
          <van-cell
            title="预约时间"
            :value="selectedBooking.BookTime"
            :border="false"
          />
          <van-cell
            v-if="selectedBooking.BookRemark"
            title="预约备注"
            :value="selectedBooking.BookRemark"
            :border="false"
          />
        </van-cell-group>

        <!-- 审核按钮（仅待审核状态显示） -->
        <div v-if="selectedBooking.Status === 0" class="flex gap-3 mt-6">
          <van-button
            type="danger"
            round
            block
            @click="handleApprove(false)"
          >
            拒绝
          </van-button>
          <van-button
            type="success"
            round
            block
            @click="handleApprove(true)"
          >
            通过
          </van-button>
        </div>

        <div v-else class="mt-6">
          <van-button
            round
            block
            @click="showDetail = false"
          >
            关闭
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
