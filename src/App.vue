<script setup lang="ts">
import { useDark } from "@@/composables/useDark"
import Layout from "@/layout/index.vue"

const { isDark, initDark } = useDark()

initDark()
</script>

<template>
  <van-config-provider :theme="isDark ? 'dark' : 'light'" un-h-full>
    <Layout />
  </van-config-provider>
</template>
