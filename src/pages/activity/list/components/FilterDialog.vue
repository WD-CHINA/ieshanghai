<script setup lang="ts">
import { getFieldListApi } from "@/pages/home/apis"
import { getPlaceListApi, getServiceTypeListApi } from "../apis"

interface Props {
  show: boolean
  /** 当前筛选条件 */
  filters: {
    SpaceId: number
    FieldId: number
    PlaceId: number
    ServiceType: number
    CanBook: number
    BeginTime: string
    EndTime: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:show": [value: boolean]
  "confirm": [filters: Props["filters"]]
  "reset": []
}>()

// 内部弹窗显示状态（用于 v-model）
const showDialog = computed({
  get: () => props.show,
  set: (value: boolean) => {
    emit("update:show", value)
  }
})

// 内部筛选条件
const localFilters = reactive({ ...props.filters })

// 基础数据
const fieldList = ref<Array<{ Id: number, FieldName: string }>>([])
const placeList = ref<Array<{ Id: number, Name: string }>>([])
const serviceTypeList = ref<Array<{ Id: number, TypeName: string }>>([])

// 选择器显示状态
const showFieldPicker = ref(false)
const showPlacePicker = ref(false)
const showServiceTypePicker = ref(false)
const showCanBookPicker = ref(false)
const showBeginTimePicker = ref(false)
const showEndTimePicker = ref(false)

// 日期数组
const beginTimeArray = ref<string[]>([])
const endTimeArray = ref<string[]>([])

// 活动类型选项
const canBookOptions = [
  { text: "全部", value: 0 },
  { text: "预约活动", value: 1 },
  { text: "常规活动", value: 2 },
  { text: "团队活动", value: 4 }
]

// 计算属性
const selectedFieldName = computed(() => {
  const field = fieldList.value.find(f => f.Id === localFilters.FieldId)
  return field?.FieldName || "全部"
})

const selectedPlaceName = computed(() => {
  const place = placeList.value.find(p => p.Id === localFilters.PlaceId)
  return place?.Name || "全部"
})

const selectedServiceTypeName = computed(() => {
  const serviceType = serviceTypeList.value.find(s => s.Id === localFilters.ServiceType)
  return serviceType?.TypeName || "全部"
})

const selectedCanBookName = computed(() => {
  const option = canBookOptions.find(o => o.value === localFilters.CanBook)
  return option?.text || "全部"
})

// 加载基础数据
async function loadBaseData() {
  try {
    // 加载空间区域列表
    const fieldRes = await getFieldListApi({ SpaceId: "0" })
    if (fieldRes.Data?.FieldList) {
      fieldList.value = fieldRes.Data.FieldList.map((f: any) => ({
        Id: f.Id,
        FieldName: f.FieldName
      }))
      // 添加"全部"选项
      fieldList.value.unshift({ Id: 0, FieldName: "全部" })
    }

    // 加载场地列表
    await loadPlaceList()

    // 加载服务类型列表
    const serviceTypeRes = await getServiceTypeListApi({ SpaceId: 0 })
    if (serviceTypeRes.Data?.ServiceTypeList) {
      serviceTypeList.value = serviceTypeRes.Data.ServiceTypeList.map(s => ({
        Id: s.Id,
        TypeName: s.TypeName
      }))
      // 添加"全部"选项
      serviceTypeList.value.unshift({ Id: 0, TypeName: "全部" })
    }
  } catch (error) {
    console.error("加载基础数据失败", error)
  }
}

// 加载场地列表
async function loadPlaceList() {
  try {
    const placeRes = await getPlaceListApi({
      SpaceId: localFilters.SpaceId,
      FieldId: localFilters.FieldId,
      Usage: "Activity"
    })
    if (placeRes.Data?.PlaceList) {
      placeList.value = placeRes.Data.PlaceList.map(p => ({
        Id: p.Id,
        Name: p.Name
      }))
      // 添加"全部"选项
      placeList.value.unshift({ Id: 0, Name: "全部" })
    }
  } catch (error) {
    console.error("加载场地列表失败", error)
  }
}

// 确认筛选
function handleConfirm() {
  emit("confirm", { ...localFilters })
  emit("update:show", false)
}

// 重置筛选
function handleReset() {
  localFilters.SpaceId = 0
  localFilters.FieldId = 0
  localFilters.PlaceId = 0
  localFilters.ServiceType = 0
  localFilters.CanBook = 0
  localFilters.BeginTime = ""
  localFilters.EndTime = ""
  beginTimeArray.value = []
  endTimeArray.value = []
  emit("reset")
}

// 空间区域选择变化时，重新加载场地列表
function handleFieldChange(value: any) {
  localFilters.FieldId = value.selectedValues[0]
  localFilters.PlaceId = 0 // 重置场地选择
  loadPlaceList()
  showFieldPicker.value = false
}

// 日期选择确认
function handleBeginTimeConfirm(value: any) {
  localFilters.BeginTime = value.selectedValues.join("-")
  beginTimeArray.value = value.selectedValues
  showBeginTimePicker.value = false
}

function handleEndTimeConfirm(value: any) {
  localFilters.EndTime = value.selectedValues.join("-")
  endTimeArray.value = value.selectedValues
  showEndTimePicker.value = false
}

// 监听显示状态
watch(() => props.show, (newVal) => {
  if (newVal) {
    // 重置为当前筛选条件
    Object.assign(localFilters, props.filters)
    // 初始化日期数组
    if (localFilters.BeginTime) {
      beginTimeArray.value = localFilters.BeginTime.split("-")
    }
    if (localFilters.EndTime) {
      endTimeArray.value = localFilters.EndTime.split("-")
    }
    loadBaseData()
  }
})
</script>

<script lang="ts">
export default {
  name: "FilterDialog"
}
</script>

<template>
  <van-popup
    v-model:show="showDialog"
    position="right"
    :style="{ height: '100%', width: '100%' }"
    :duration="0.3"
    closeable
    close-icon-position="top-right"
  >
    <div un-h-full un-flex un-flex-col>
      <div un-px-20px un-pt-20px un-pb-16px un-border-b="1px_solid_#ebedf0">
        <h3 un-text-18px un-font-600 un-m-0>
          筛选条件
        </h3>
      </div>

      <div un-flex-1 un-overflow-y-auto>
        <div un-px-20px un-py-16px un-space-y-16px>
          <!-- 空间区域 -->
          <van-field
            :model-value="selectedFieldName"
            label="空间区域"
            placeholder="请选择空间区域"
            readonly
            is-link
            @click="showFieldPicker = true"
          />

          <!-- 场地 -->
          <van-field
            :model-value="selectedPlaceName"
            label="场地"
            placeholder="请选择场地"
            readonly
            is-link
            :disabled="localFilters.FieldId === 0"
            @click="localFilters.FieldId !== 0 && (showPlacePicker = true)"
          />

          <!-- 服务类型 -->
          <van-field
            :model-value="selectedServiceTypeName"
            label="服务类型"
            placeholder="请选择服务类型"
            readonly
            is-link
            @click="showServiceTypePicker = true"
          />

          <!-- 活动类型 -->
          <van-field
            :model-value="selectedCanBookName"
            label="活动类型"
            placeholder="请选择活动类型"
            readonly
            is-link
            @click="showCanBookPicker = true"
          />

          <!-- 开始日期 -->
          <van-field
            :model-value="localFilters.BeginTime || '请选择开始日期'"
            label="开始日期"
            placeholder="请选择开始日期"
            readonly
            is-link
            @click="showBeginTimePicker = true"
          />

          <!-- 结束日期 -->
          <van-field
            :model-value="localFilters.EndTime || '请选择结束日期'"
            label="结束日期"
            placeholder="请选择结束日期"
            readonly
            is-link
            @click="showEndTimePicker = true"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div un-px-20px un-py-16px un-border-t="1px_solid_#ebedf0" un-flex un-gap-12px>
        <van-button
          round
          block
          @click="handleReset"
        >
          重置
        </van-button>
        <van-button
          type="primary"
          round
          block
          @click="handleConfirm"
        >
          确定
        </van-button>
      </div>
    </div>

    <!-- 空间区域选择器 -->
    <van-popup v-model:show="showFieldPicker" position="bottom" round>
      <van-picker
        :columns="fieldList.map(f => ({ text: f.FieldName, value: f.Id }))"
        @confirm="handleFieldChange"
        @cancel="showFieldPicker = false"
      />
    </van-popup>

    <!-- 场地选择器 -->
    <van-popup v-model:show="showPlacePicker" position="bottom" round>
      <van-picker
        :columns="placeList.map(p => ({ text: p.Name, value: p.Id }))"
        @confirm="(value: any) => { localFilters.PlaceId = value.selectedValues[0]; showPlacePicker = false }"
        @cancel="showPlacePicker = false"
      />
    </van-popup>

    <!-- 服务类型选择器 -->
    <van-popup v-model:show="showServiceTypePicker" position="bottom" round>
      <van-picker
        :columns="serviceTypeList.map(s => ({ text: s.TypeName, value: s.Id }))"
        @confirm="(value: any) => { localFilters.ServiceType = value.selectedValues[0]; showServiceTypePicker = false }"
        @cancel="showServiceTypePicker = false"
      />
    </van-popup>

    <!-- 活动类型选择器 -->
    <van-popup v-model:show="showCanBookPicker" position="bottom" round>
      <van-picker
        :columns="canBookOptions"
        @confirm="(value: any) => { localFilters.CanBook = value.selectedValues[0]; showCanBookPicker = false }"
        @cancel="showCanBookPicker = false"
      />
    </van-popup>

    <!-- 开始日期选择器 -->
    <van-popup v-model:show="showBeginTimePicker" position="bottom" round>
      <van-date-picker
        v-model="beginTimeArray"
        title="选择开始日期"
        @confirm="handleBeginTimeConfirm"
        @cancel="showBeginTimePicker = false"
      />
    </van-popup>

    <!-- 结束日期选择器 -->
    <van-popup v-model:show="showEndTimePicker" position="bottom" round>
      <van-date-picker
        v-model="endTimeArray"
        title="选择结束日期"
        @confirm="handleEndTimeConfirm"
        @cancel="showEndTimePicker = false"
      />
    </van-popup>
  </van-popup>
</template>
