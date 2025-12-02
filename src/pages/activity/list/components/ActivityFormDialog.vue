<script setup lang="ts">
import type { ActivityItem, SubmitActivityRequestData } from "../apis/type"
import dayjs from "dayjs"
import { getPlaceListApi, getServiceTypeListApi, submitActivityApi } from "../apis"

interface Props {
  /** 是否显示弹窗 */
  show: boolean
  /** 模式: add-新增, edit-编辑, view-查看 */
  mode?: "add" | "edit" | "view"
  /** 初始数据（编辑/查看时传入） */
  initialData?: ActivityItem | null
}

const props = withDefaults(defineProps<Props>(), {
  mode: "add",
  initialData: null
})

const emit = defineEmits<{
  "update:show": [value: boolean]
  "submit": []
  "cancel": []
}>()

// 内部弹窗显示状态（用于 v-model）
const showDialog = computed({
  get: () => props.show,
  set: (value: boolean) => {
    emit("update:show", value)
    if (!value) {
      emit("cancel")
    }
  }
})

// 提交状态
const submitting = ref(false)

// 表单数据
const formData = reactive<SubmitActivityRequestData>({
  Id: 0,
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

// 基础数据
const placeList = ref<Array<{ Id: number, Name: string }>>([])
const serviceTypeList = ref<Array<{ Id: number, TypeName: string }>>([])

// 选择器显示状态
const showPlacePicker = ref(false)
const showServiceTypePicker = ref(false)
const showCanBookTypePicker = ref(false)
const showFormBeginTimePicker = ref(false)
const showFormEndTimePicker = ref(false)
const showBookBeginTimePicker = ref(false)
const showBookEndTimePicker = ref(false)

// 日期时间选择器数组（用于 v-model）
const formBeginTimeArray = ref<string[]>([])
const formEndTimeArray = ref<string[]>([])
const bookBeginTimeArray = ref<string[]>([])
const bookEndTimeArray = ref<string[]>([])

// 计算属性
const dialogTitle = computed(() => {
  if (props.mode === "add") return "新增活动排期"
  if (props.mode === "edit") return "编辑活动排期"
  return "查看活动排期"
})

const isViewMode = computed(() => props.mode === "view")
const isEditMode = computed(() => props.mode === "edit" || props.mode === "add")

const selectedPlaceName = computed(() => {
  const place = placeList.value.find(p => p.Id === formData.PlaceId)
  return place?.Name || "请选择场地"
})

const selectedServiceTypeName = computed(() => {
  const serviceType = serviceTypeList.value.find(s => s.Id === formData.ServiceType)
  return serviceType?.TypeName || "请选择服务类型"
})

const canBookTypeOptions = [
  { text: "预约活动", value: 1 },
  { text: "常规活动", value: 2 },
  { text: "团队活动", value: 4 }
]

const selectedCanBookTypeName = computed(() => {
  const option = canBookTypeOptions.find(o => o.value === formData.CanBook)
  return option?.text || "请选择活动类型"
})

// 初始化表单数据
function initFormData() {
  if (props.initialData && (props.mode === "edit" || props.mode === "view")) {
    // 编辑/查看模式：从 initialData 加载数据
    formData.Id = props.initialData.Id
    formData.ActName = props.initialData.ActName
    formData.ActNameEn = props.initialData.ActNameEn || ""
    formData.ServiceType = props.initialData.ServiceType
    formData.PlaceId = props.initialData.PlaceId
    formData.BeginTime = props.initialData.BeginDateTime
    formData.EndTime = props.initialData.EndDateTime
    formData.LengthMinutes = props.initialData.LengthMinutes
    formData.ExpectPeople = props.initialData.ExpectPeople
    formData.Brief = props.initialData.Brief || ""
    formData.BriefEn = props.initialData.BriefEn || ""
    formData.CanBook = props.initialData.CanBook
    formData.CanBookQty = props.initialData.CanBookQty
    formData.UserCanBookQty = props.initialData.UserCanBookQty
    formData.BookBeginTime = props.initialData.BookBeginTime || ""
    formData.BookEndTime = props.initialData.BookEndTime || ""
    formData.BookComment = props.initialData.BookComment || ""
    formData.ListImg = ""
    formData.ShowImg = ""
  } else {
    // 新增模式：重置表单
    formData.Id = 0
    formData.ActName = ""
    formData.ActNameEn = ""
    formData.ServiceType = 0
    formData.PlaceId = 0
    formData.BeginTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
    formData.EndTime = dayjs().add(1, "hour").format("YYYY-MM-DD HH:mm:ss")
    formData.LengthMinutes = 60
    formData.ExpectPeople = 0
    formData.Brief = ""
    formData.BriefEn = ""
    formData.CanBook = 2
    formData.CanBookQty = 0
    formData.UserCanBookQty = 0
    formData.BookBeginTime = ""
    formData.BookEndTime = ""
    formData.BookComment = ""
    formData.ListImg = ""
    formData.ShowImg = ""
  }
  calculateDuration()
}

// 计算活动时长
function calculateDuration() {
  if (formData.BeginTime && formData.EndTime) {
    const begin = dayjs(formData.BeginTime)
    const end = dayjs(formData.EndTime)
    if (end.isAfter(begin)) {
      formData.LengthMinutes = end.diff(begin, "minute")
    }
  }
}

// 加载基础数据
async function loadBaseData() {
  try {
    // 加载场地列表
    const placeRes = await getPlaceListApi({
      SpaceId: 0,
      FieldId: 0,
      Usage: "Activity"
    })
    if (placeRes.Data?.PlaceList) {
      placeList.value = placeRes.Data.PlaceList.map(p => ({
        Id: p.Id,
        Name: p.Name
      }))
    }

    // 加载服务类型列表
    const serviceTypeRes = await getServiceTypeListApi({ SpaceId: 0 })
    if (serviceTypeRes.Data?.ServiceTypeList) {
      serviceTypeList.value = serviceTypeRes.Data.ServiceTypeList.map(s => ({
        Id: s.Id,
        TypeName: s.TypeName
      }))
    }
  } catch (error) {
    console.error("加载基础数据失败", error)
  }
}

// 提交表单
async function handleSubmit() {
  if (isViewMode.value) return

  // 表单验证
  if (!formData.ActName.trim()) {
    showToast("请输入活动名称")
    return
  }
  if (!formData.PlaceId) {
    showToast("请选择场地")
    return
  }
  if (!formData.ServiceType) {
    showToast("请选择服务类型")
    return
  }
  if (!formData.BeginTime) {
    showToast("请选择活动开始时间")
    return
  }
  if (!formData.EndTime) {
    showToast("请选择活动结束时间")
    return
  }
  if (dayjs(formData.EndTime).isBefore(dayjs(formData.BeginTime))) {
    showToast("结束时间不能早于开始时间")
    return
  }
  if (!formData.ExpectPeople || formData.ExpectPeople <= 0) {
    showToast("请输入预计参与人数")
    return
  }

  // 预约活动额外验证
  if (formData.CanBook === 1) {
    if (!formData.CanBookQty || formData.CanBookQty <= 0) {
      showToast("请输入最大可预约数量")
      return
    }
    if (!formData.UserCanBookQty || formData.UserCanBookQty <= 0) {
      showToast("请输入单用户可预约数量")
      return
    }
    if (!formData.BookBeginTime) {
      showToast("请选择预约开始时间")
      return
    }
    if (!formData.BookEndTime) {
      showToast("请选择预约结束时间")
      return
    }
  } else {
    // 非预约活动，清空预约相关字段
    formData.CanBookQty = 0
    formData.UserCanBookQty = 0
    formData.BookBeginTime = ""
    formData.BookEndTime = ""
  }

  try {
    submitting.value = true
    await submitActivityApi({
      ...formData,
      BeginTime: dayjs(formData.BeginTime).format("YYYY-MM-DD HH:mm:ss"),
      EndTime: dayjs(formData.EndTime).format("YYYY-MM-DD HH:mm:ss"),
      BookBeginTime: formData.BookBeginTime ? dayjs(formData.BookBeginTime).format("YYYY-MM-DD HH:mm:ss") : "",
      BookEndTime: formData.BookEndTime ? dayjs(formData.BookEndTime).format("YYYY-MM-DD HH:mm:ss") : ""
    })
    showToast("提交成功")
    emit("update:show", false)
    emit("submit")
  } catch (error: any) {
    console.error("提交失败", error)
    showToast(error.Message || "提交失败")
  } finally {
    submitting.value = false
  }
}

// 监听显示状态变化
watch(() => props.show, (newVal) => {
  if (newVal) {
    initFormData()
    loadBaseData()
  }
})

// 日期时间选择器确认处理
function handleFormBeginTimeConfirm(value: any) {
  const dateStr = value.selectedValues.join("-")
  const timeStr = value.selectedValues.slice(3).join(":")
  formData.BeginTime = `${dateStr} ${timeStr}:00`
  formBeginTimeArray.value = value.selectedValues
  showFormBeginTimePicker.value = false
  calculateDuration()
}

function handleFormEndTimeConfirm(value: any) {
  const dateStr = value.selectedValues.join("-")
  const timeStr = value.selectedValues.slice(3).join(":")
  formData.EndTime = `${dateStr} ${timeStr}:00`
  formEndTimeArray.value = value.selectedValues
  showFormEndTimePicker.value = false
  calculateDuration()
}

function handleBookBeginTimeConfirm(value: any) {
  const dateStr = value.selectedValues.join("-")
  const timeStr = value.selectedValues.slice(3).join(":")
  formData.BookBeginTime = `${dateStr} ${timeStr}:00`
  bookBeginTimeArray.value = value.selectedValues
  showBookBeginTimePicker.value = false
}

function handleBookEndTimeConfirm(value: any) {
  const dateStr = value.selectedValues.join("-")
  const timeStr = value.selectedValues.slice(3).join(":")
  formData.BookEndTime = `${dateStr} ${timeStr}:00`
  bookEndTimeArray.value = value.selectedValues
  showBookEndTimePicker.value = false
}

// 初始化日期时间数组
function initDateTimeArrays() {
  if (formData.BeginTime) {
    const begin = dayjs(formData.BeginTime)
    formBeginTimeArray.value = [
      begin.format("YYYY"),
      begin.format("MM"),
      begin.format("DD"),
      begin.format("HH"),
      begin.format("mm")
    ]
  }
  if (formData.EndTime) {
    const end = dayjs(formData.EndTime)
    formEndTimeArray.value = [
      end.format("YYYY"),
      end.format("MM"),
      end.format("DD"),
      end.format("HH"),
      end.format("mm")
    ]
  }
  if (formData.BookBeginTime) {
    const bookBegin = dayjs(formData.BookBeginTime)
    bookBeginTimeArray.value = [
      bookBegin.format("YYYY"),
      bookBegin.format("MM"),
      bookBegin.format("DD"),
      bookBegin.format("HH"),
      bookBegin.format("mm")
    ]
  }
  if (formData.BookEndTime) {
    const bookEnd = dayjs(formData.BookEndTime)
    bookEndTimeArray.value = [
      bookEnd.format("YYYY"),
      bookEnd.format("MM"),
      bookEnd.format("DD"),
      bookEnd.format("HH"),
      bookEnd.format("mm")
    ]
  }
}

// 监听显示状态变化
watch(() => props.show, (newVal) => {
  if (newVal) {
    initFormData()
    initDateTimeArrays()
    loadBaseData()
  }
})

// 监听开始/结束时间变化，自动计算时长
watch([() => formData.BeginTime, () => formData.EndTime], () => {
  calculateDuration()
})
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
          {{ dialogTitle }}
        </h3>
      </div>

      <div un-flex-1 un-overflow-y-auto>
        <van-form @submit="handleSubmit">
          <!-- 活动名称 -->
          <van-field
            v-model="formData.ActName"
            label="活动名称"
            placeholder="请输入活动名称"
            required
            :readonly="isViewMode"
            :rules="[{ required: true, message: '请输入活动名称' }]"
          />
          <van-field
            v-model="formData.ActNameEn"
            label="活动名称（英文）"
            placeholder="请输入活动名称（英文）"
            :readonly="isViewMode"
          />

          <!-- 场地选择 -->
          <van-field
            :model-value="selectedPlaceName"
            label="场地"
            placeholder="请选择场地"
            required
            readonly
            is-link
            :rules="[{ required: true, message: '请选择场地' }]"
            :disabled="isViewMode"
            @click="!isViewMode && (showPlacePicker = true)"
          />

          <!-- 服务类型选择 -->
          <van-field
            :model-value="selectedServiceTypeName"
            label="服务类型"
            placeholder="请选择服务类型"
            required
            readonly
            is-link
            :disabled="isViewMode"
            @click="!isViewMode && (showServiceTypePicker = true)"
          />

          <!-- 活动类型选择 -->
          <van-field
            :model-value="selectedCanBookTypeName"
            label="活动类型"
            placeholder="请选择活动类型"
            required
            readonly
            is-link
            :disabled="isViewMode"
            @click="!isViewMode && (showCanBookTypePicker = true)"
          />

          <!-- 活动开始时间 -->
          <van-field
            :model-value="formData.BeginTime ? dayjs(formData.BeginTime).format('YYYY-MM-DD HH:mm') : ''"
            label="活动开始时间"
            placeholder="请选择活动开始时间"
            required
            readonly
            is-link
            :disabled="isViewMode"
            @click="!isViewMode && (showFormBeginTimePicker = true)"
          />

          <!-- 活动结束时间 -->
          <van-field
            :model-value="formData.EndTime ? dayjs(formData.EndTime).format('YYYY-MM-DD HH:mm') : ''"
            label="活动结束时间"
            placeholder="请选择活动结束时间"
            required
            readonly
            is-link
            :disabled="isViewMode"
            @click="!isViewMode && (showFormEndTimePicker = true)"
          />

          <!-- 活动时长 -->
          <van-field
            :model-value="`${formData.LengthMinutes} 分钟`"
            label="活动时长"
            readonly
          />

          <!-- 预计参与人数 -->
          <van-field
            v-model.number="formData.ExpectPeople"
            type="number"
            label="预计参与人数"
            placeholder="请输入预计参与人数"
            required
            :readonly="isViewMode"
            :rules="[{ required: true, message: '请输入预计参与人数' }]"
          />

          <!-- 活动简介 -->
          <van-field
            v-model="formData.Brief"
            label="活动简介"
            type="textarea"
            placeholder="请输入活动简介"
            rows="3"
            :readonly="isViewMode"
          />
          <van-field
            v-model="formData.BriefEn"
            label="活动简介（英文）"
            type="textarea"
            placeholder="请输入活动简介（英文）"
            rows="3"
            :readonly="isViewMode"
          />

          <!-- 预约设置（仅预约活动显示） -->
          <template v-if="formData.CanBook === 1">
            <van-cell title="预约设置" />
            <van-field
              v-model.number="formData.CanBookQty"
              type="number"
              label="最大可预约数量"
              placeholder="请输入最大可预约数量"
              required
              :readonly="isViewMode"
            />
            <van-field
              v-model.number="formData.UserCanBookQty"
              type="number"
              label="单用户可预约数量"
              placeholder="请输入单用户可预约数量"
              required
              :readonly="isViewMode"
            />
            <van-field
              :model-value="formData.BookBeginTime ? dayjs(formData.BookBeginTime).format('YYYY-MM-DD HH:mm') : ''"
              label="预约开始时间"
              placeholder="请选择预约开始时间"
              required
              readonly
              is-link
              :disabled="isViewMode"
              @click="!isViewMode && (showBookBeginTimePicker = true)"
            />
            <van-field
              :model-value="formData.BookEndTime ? dayjs(formData.BookEndTime).format('YYYY-MM-DD HH:mm') : ''"
              label="预约结束时间"
              placeholder="请选择预约结束时间"
              required
              readonly
              is-link
              :disabled="isViewMode"
              @click="!isViewMode && (showBookEndTimePicker = true)"
            />
            <van-field
              v-model="formData.BookComment"
              label="预约说明"
              type="textarea"
              placeholder="请输入预约说明"
              rows="2"
              :readonly="isViewMode"
            />
          </template>

          <!-- 提交按钮（仅新增/编辑模式显示） -->
          <div v-if="isEditMode" un-px-20px un-py-16px>
            <van-button
              type="primary"
              round
              block
              :loading="submitting"
              native-type="submit"
            >
              提交
            </van-button>
          </div>
        </van-form>
      </div>
    </div>

    <!-- 场地选择器 -->
    <van-popup v-model:show="showPlacePicker" position="bottom" round>
      <van-picker
        :columns="placeList.map(p => ({ text: p.Name, value: p.Id }))"
        @confirm="(value: any) => { formData.PlaceId = value.selectedValues[0]; showPlacePicker = false }"
        @cancel="showPlacePicker = false"
      />
    </van-popup>

    <!-- 服务类型选择器 -->
    <van-popup v-model:show="showServiceTypePicker" position="bottom" round>
      <van-picker
        :columns="serviceTypeList.map(s => ({ text: s.TypeName, value: s.Id }))"
        @confirm="(value: any) => { formData.ServiceType = value.selectedValues[0]; showServiceTypePicker = false }"
        @cancel="showServiceTypePicker = false"
      />
    </van-popup>

    <!-- 活动类型选择器 -->
    <van-popup v-model:show="showCanBookTypePicker" position="bottom" round>
      <van-picker
        :columns="canBookTypeOptions"
        @confirm="(value: any) => { formData.CanBook = value.selectedValues[0]; showCanBookTypePicker = false }"
        @cancel="showCanBookTypePicker = false"
      />
    </van-popup>

    <!-- 活动开始时间选择器 -->
    <van-popup v-model:show="showFormBeginTimePicker" position="bottom" round>
      <van-date-picker
        v-model="formBeginTimeArray"
        type="datetime"
        title="选择活动开始时间"
        @confirm="handleFormBeginTimeConfirm"
        @cancel="showFormBeginTimePicker = false"
      />
    </van-popup>

    <!-- 活动结束时间选择器 -->
    <van-popup v-model:show="showFormEndTimePicker" position="bottom" round>
      <van-date-picker
        v-model="formEndTimeArray"
        type="datetime"
        title="选择活动结束时间"
        @confirm="handleFormEndTimeConfirm"
        @cancel="showFormEndTimePicker = false"
      />
    </van-popup>

    <!-- 预约开始时间选择器 -->
    <van-popup v-model:show="showBookBeginTimePicker" position="bottom" round>
      <van-date-picker
        v-model="bookBeginTimeArray"
        type="datetime"
        title="选择预约开始时间"
        @confirm="handleBookBeginTimeConfirm"
        @cancel="showBookBeginTimePicker = false"
      />
    </van-popup>

    <!-- 预约结束时间选择器 -->
    <van-popup v-model:show="showBookEndTimePicker" position="bottom" round>
      <van-date-picker
        v-model="bookEndTimeArray"
        type="datetime"
        title="选择预约结束时间"
        @confirm="handleBookEndTimeConfirm"
        @cancel="showBookEndTimePicker = false"
      />
    </van-popup>
  </van-popup>
</template>
