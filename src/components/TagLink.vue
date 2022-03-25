<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true,
  },
})

</script>

<template>
  <router-link class="tag-link" :to="`/posts?tag=${name}`">
    #{{ name }}
  </router-link>
</template>

<style lang="css" scoped>
.tag-link {
}

.tag-link + .tag-link {
  margin-left: 4px;
}
</style>
