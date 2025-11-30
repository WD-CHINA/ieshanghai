<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

// 功能模块列表
const moduleList = [
  {
    id: "activity",
    title: "活动排期",
    desc: "管理活动排期和预约情况",
    icon: "calendar-o",
    path: "/activity/list",
    gradient: "from-blue-500 via-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100"
  },
  {
    id: "venue",
    title: "场地使用",
    desc: "管理场地使用申请",
    icon: "shop-o",
    path: "/venue/use",
    gradient: "from-green-500 via-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100"
  }
]

// 跳转到功能模块
function navigateToModule(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="home-page min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <!-- 页面标题区域 -->
    <div class="px-6 pt-12 pb-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          公共文化空间
        </h1>
        <p class="text-base text-gray-600">
          数字化运营平台
        </p>
      </div>
    </div>

    <!-- 功能模块入口 -->
    <div class="px-6 pb-8">
      <div class="grid grid-cols-1 gap-5">
        <div
          v-for="module in moduleList"
          :key="module.id"
          class="module-card group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          :class="module.bgColor"
          @click="navigateToModule(module.path)"
        >
          <!-- 背景装饰 -->
          <div
            class="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-150"
            :class="`bg-gradient-to-br ${module.gradient}`"
          />

          <div class="relative flex items-center">
            <!-- 图标区域 -->
            <div
              class="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              :class="`bg-gradient-to-br ${module.gradient} shadow-lg`"
            >
              <van-icon :name="module.icon" size="28" class="text-white" />
            </div>

            <!-- 文字区域 -->
            <div class="flex-1 ml-5">
              <h3 class="text-xl font-bold text-gray-900 mb-1.5 group-hover:text-gray-800 transition-colors">
                {{ module.title }}
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                {{ module.desc }}
              </p>
            </div>

            <!-- 箭头 -->
            <div class="flex-shrink-0 ml-4 transition-transform duration-300 group-hover:translate-x-1">
              <van-icon name="arrow" size="18" class="text-gray-400 group-hover:text-gray-600" />
            </div>
          </div>

          <!-- 底部装饰线 -->
          <div
            class="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
            :class="`bg-gradient-to-r ${module.gradient}`"
          />
        </div>
      </div>
    </div>

    <!-- 底部提示信息 -->
    <div class="px-6 pb-6">
      <div class="text-center">
        <p class="text-xs text-gray-400">
          选择功能模块开始使用
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: env(safe-area-inset-bottom);
}

.module-card {
  -webkit-tap-highlight-color: transparent;
}

.module-card:active {
  transform: scale(0.98);
}
</style>
