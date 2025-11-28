<script setup lang="ts">
import type { LoginRequestData } from "./apis/type"
import { setClinetMachineGuid } from "@/common/utils/cache/cookies"
import { getCaptchaApi, loginApi } from "./apis"

const router = useRouter()

const captchaImage = ref("")
const loading = ref(false)

const loginFormData: LoginRequestData = reactive({
  Account: "",
  Password: "",
  ValidateCode: ""
})

onMounted(async () => {
  getCaptcha()
})
async function getCaptcha() {
  const vHeadRand = String(10000 * Math.random()).substring(0, 4)
  const { Data } = await getCaptchaApi({ captchaId: vHeadRand })
  captchaImage.value = Data.Img
}

function onSubmit() {
  loading.value = true
  loginApi(loginFormData).then(({ Data }) => {
    setClinetMachineGuid(Data.Guid)
    router.push("/")
  }).catch(() => {
    getCaptcha()
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
          v-model="loginFormData.Account"
          name="username"
          label="用户名"
          size="large"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="loginFormData.Password"
          type="password"
          name="password"
          label="密码"
          size="large"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="loginFormData.ValidateCode"
          name="captchaVerifyParam"
          label="验证码"
          size="large"
          :rules="[{ required: true, message: '请填写验证码' }]"
        >
          <template #button>
            <van-image :src="captchaImage" />
          </template>
        </van-field>
      </van-cell-group>
      <div un-mx-16px un-my-32px>
        <van-button
          :loading="loading"
          type="primary"
          native-type="submit"
          size="large"
          round
          block
        >
          登 录
        </van-button>
      </div>
    </van-form>
  </div>
</template>
