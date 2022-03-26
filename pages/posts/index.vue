<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { formatDate } from '@/utils'
import TagLink from '@/components/TagLink.vue'

useHead({
  title: 'Blog - Keroz',
})

const router = useRouter()
const currentRoute = useRoute()

const posts = router.getRoutes()
  .filter(({ path }) => path.startsWith('/posts') && path !== '/posts')
  .sort((a, b) => (+new Date(b.meta.frontmatter.publishedTime) - +new Date(a.meta.frontmatter.publishedTime)))
  .map((route) => {
    const { title, publishedTime, tags } = route.meta.frontmatter

    return {
      title: title || route.name,
      link: route.path,
      publishedTime,
      tags,
    }
  })

const filteredPosts = ref(posts)

function filterPostsByTag(tag: any) {
  if (tag)
    filteredPosts.value = posts.filter(post => post.tags ? post.tags.includes(tag) : false)
  else
    filteredPosts.value = posts
}

const tagQuery = computed(() => (currentRoute?.query?.tag))

if (tagQuery.value)
  filterPostsByTag(tagQuery.value)

watch(tagQuery, filterPostsByTag)
</script>

<template>
  <div class="prose m-auto">
    <h1 v-if="tagQuery">
      Tag: {{ tagQuery }} <sup><ri:close-line class="inline cursor-pointer opacity-50 hover:opacity-100" @click="$router.push('/posts')" /></sup>
    </h1>
    <template v-if="posts.length === 0">
      Nothing here yet!
    </template>
    <template v-else>
      <app-link
        v-for="(post, index) in filteredPosts"
        :key="index"
        :to="post.link"
        class="item block font-normal mb-6 mt-2 no-underline"
      >
        <div class="text-lg">
          {{ post.title }}
        </div>
        <div v-if="post.publishedTime" class="opacity-50 text-sm -mt-1">
          {{ formatDate(post.publishedTime) }}
        </div>
        <div v-if="post.tags && post.tags.length > 0" class="text-sm">
          <tag-link v-for="tag in post.tags" :key="tag" :name="tag" :class="tag === tagQuery ? 'opacity-100' : 'opacity-50'" />
        </div>
      </app-link>
    </template>
  </div>
</template>
