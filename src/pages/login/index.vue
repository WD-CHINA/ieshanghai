<script setup lang="ts">
import type { LoginRequestData } from "./apis/type"
import { setH5SiteSession } from "@/common/utils/cache/cookies"
import { loginApi } from "./apis"

const router = useRouter()

const loading = ref(false)

const loginFormData: LoginRequestData = reactive({
  Account: "",
  Password: "",
  captchaVerifyParam: ""
})

onMounted(async () => {
  await nextTick()
  initCaptcha()
})

async function initCaptcha() {
  // 等待阿里云验证码脚本加载完成
  // 获取验证码实例
  await window?.initAliyunCaptcha?.({
    // 场景ID。通过步骤一添加验证场景后，您可以在验证码场景列表，获取该场景的场景ID
    SceneId: "vnwrllud",
    // 必填，身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标。
    prefix: "pn8ihm",
    // 验证码模式。embed表示要集成的验证码模式为嵌入式。无需修改
    mode: "embed",
    // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
    element: "#captcha-element",
    // 触发业务请求的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
    button: "#button1",
    // 业务请求(带验证码校验)回调函数，无需修改
    captchaVerifyCallback,
    // 业务请求结果回调函数，无需修改
    onBizResultCallback,
    // 绑定验证码实例函数，无需修改
    getInstance,
    // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
    slideStyle: {
      width: 320,
      height: 40
    },
    // 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en）
    language: "cn",
    // 完成验证后，是否立即发送验证请求（调用captchaVerifyCallback函数）
    immediate: false
  })
}
function onBizResultCallback() {
  // 业务请求结果回调
}

function getInstance() {
  // 绑定验证码实例
}
function captchaVerifyCallback(d: string) {
  loginFormData.captchaVerifyParam = encodeURIComponent(d)
}
function onSubmit() {
  loading.value = true
  loginApi(loginFormData).then(({ Data }) => {
    setH5SiteSession(Data.Guid)
    router.push("/")
  }).catch(() => {
    initCaptcha()
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <div un-h-full un-flex-center un-flex-col un-select-none>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="loginFormData.Account" name="username" label="用户名" size="large"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="loginFormData.Password" type="password" name="password" label="密码" size="large"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div id="captcha-element" />
      </van-cell-group>
      <div un-mx-16px un-my-32px>
        <van-button :loading="loading" type="primary" native-type="submit" size="large" round id="button1" block>
          登 录
        </van-button>
      </div>
    </van-form>
  </div>
</template>
