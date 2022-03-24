<template>
  <div v-if="frontmatter.title" class="prose m-auto mb-8">
    <h1>
      {{ title }}
    </h1>
    <p class="opacity-50 !-mt-2">
      Created at {{ formatDate($route.meta.createdTime) }}, last updated at {{ formatDate($route.meta.updatedTime) }}
    </p>
  </div>
  <article ref="content">
    <!-- See vite.config.ts -->
    <!-- 由于配置 wrapperClasses 不生效，故手动设置 -->
    <div class="prose m-auto">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { formatDate } from '@/utils'

const props = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})

const { title } = props.frontmatter

// See vite.config.ts
// 由于配置 headEnabled 不生效，故手动设置
useHead({
  ...props.frontmatter,
  title: `${title} - Blog - Keroz`,
})
</script>
