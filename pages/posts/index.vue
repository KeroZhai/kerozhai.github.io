<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { formatDate } from '@/utils'

useHead({
  title: 'Blog - Keroz',
})

const router = useRouter()

const posts = router.getRoutes()
  .filter(({ path }) => path.startsWith('/posts') && path !== '/posts')
  .sort((a, b) => (a.meta.updatedTimestamp - b.meta.updatedTimestamp))
  .map((route) => {
    const { title, createdTime } = route.meta.frontmatter

    return {
      title: title || route.name,
      link: route.path,
      createdTime,
    }
  })
</script>

<template>
  <div class="prose m-auto">
    <template v-if="posts.length === 0">
      Nothing here yet!
    </template>
    <template v-else>
      <app-link
        v-for="(post, index) in posts"
        :key="index"
        :to="post.link"
        class="item block font-normal mb-6 mt-2 no-underline"
      >
        <div class="text-lg">
          {{ post.title }}
        </div>
        <div class="opacity-50 text-sm -mt-1">
          {{ formatDate(post.updatedTime) }}
        </div>
      </app-link>
    </template>
  </div>
</template>
