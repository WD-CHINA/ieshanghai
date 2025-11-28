<script setup lang="ts">
import { useRouter } from "vue-router"
import { getFieldListApi } from "./apis"

const router = useRouter()

onMounted(async () => {
  try {
    const { Data } = await getFieldListApi({ SpaceId: "10000001" })
    console.log(Data)
  } catch (error) {
    console.error(error)
    router.replace("login")
  }
})
</script>

<template>
  <div un-px-20px un-py-26px un-select-none>
    首页
  </div>
</template>
