<template>
  <div v-if="title" class="prose m-auto mb-8">
    <h1>
      {{ title }}
    </h1>
    <p v-if="publishedTime" class="opacity-50 !-mt-2">
      {{ `Published at ${formatDate(publishedTime)}${updatedTime ? ', last updated at ' + formatDate(updatedTime) : ''}` }}
    </p>
    <div v-if="tags && tags.length > 0" class="text-sm">
      <tag-link v-for="tag in tags" :key="tag" :name="tag" />
    </div>
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
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { formatDate } from '@/utils'
import TagLink from '@/components/TagLink.vue'

const props = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})

const route = useRoute()
const { title, tags, publishedTime, updatedTime } = props.frontmatter

// See vite.config.ts
// 由于配置 headEnabled 不生效，故手动设置
useHead({
  ...props.frontmatter,
  title: `${title}${route.path === '/' ? '' : ' - Keroz'}`,
})
</script>
