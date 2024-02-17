<template>
  <div class="search-bar">
    <input v-model="searchContent" type="text" placeholder="搜尋 ..." />
    <div class="search-btn" @click="searchHandler">
      <i class="fa-solid fa-magnifying-glass" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import router from '@/router'
import { usePostStore } from '@/stores/post'

const route = useRoute()
const postStore = usePostStore()
const { routeQuery } = storeToRefs(postStore)
const { patchQuery } = postStore

const searchContent = ref(null)
if (route.query?.q) searchContent.value = route.query.q
const searchHandler = async () => {
  await patchQuery([
    route.query,
    {
      q: searchContent.value,
      s: 'new',
      p: null
    }
  ])
  await router.push({
    path: '/search',
    query: routeQuery.value
  })
  if (route.path === '/search') {
    window.location.reload()
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.search-bar {
  display: flex;
  align-items: stretch;
  width: 100%;
}

input {
  border: 2px solid var(--dark);
  border-radius: 8px 0 0 15px;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  min-height: 100%;
  font-size: px(20);
  color: $c-white;
  background-color: $c-first;
  border: 2px solid var(--dark);
  border-radius: 0 8px 15px 0;
  user-select: none;
  cursor: pointer;
  border-left: unset;

  &:hover {
    background-color: rgba($c-first, 0.95);
  }
}
</style>
