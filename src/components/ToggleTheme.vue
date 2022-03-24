<template>
  <a class="select-none" title="Toggle Color Scheme" @click="useToggle(isDark)">
    <ri-moon-line v-show="isDark" />
    <ri-sun-line v-show="!isDark" />
  </a>
</template>

<script setup lang='ts'>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
</script>
