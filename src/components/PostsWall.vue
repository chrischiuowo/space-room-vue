<template>
  <div class="posts-outer">
    <div class="base-tools" data-aos="fade" data-aos-delay="1000">
      <FilterSort />
      <SearchBar />
    </div>
    <div class="posts">
      <template v-if="posts.length">
        <PostItem v-for="post in posts" :key="post._id" :post="post" />
      </template>
      <template v-else>
        <PostItem :post="{}" />
      </template>
    </div>
    <div ref="loadDetector" class="loading-detector" />
  </div>
  <PostBox />
</template>

<script setup>
import PostItem from '@/components/PostItem.vue'
import PostBox from '@/components/box/PostBox.vue'
import SearchBar from '@/components/SearchBar.vue'
import FilterSort from '@/components/FilterSort.vue'
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { getPostsByRoute } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const postStore = usePostStore()

const { posts, routeQuery } = storeToRefs(postStore)
const { openAlert, openLoading, closeLoading } = modalStore
const { patchPosts, resetPosts, patchQuery, addPosts } = postStore
const postPage = ref(1)
const isLoaded = ref(false)
const loadDetector = ref(null)
const isStopScroll = ref(false)

// 取得所有貼文
const getPosts = async () => {
  openLoading('取得貼文中')
  isStopScroll.value = true
  if (posts.value?.length) postPage.value += 1
  await patchQuery([route.query, { p: postPage.value }])
  const { data } = await getPostsByRoute(routeQuery.value)

  // 判斷是否已經載入完全部貼文
  if (data.data?.length === 0) {
    isLoaded.value = true
    isStopScroll.value = true
    postPage.value -= 1
    closeLoading()
    openAlert('success', '已查看所有貼文')
    return false
  }

  // 判斷是否已抓取過資料
  if (posts.value?.length) {
    await addPosts(data.data)
    isStopScroll.value = false
  } else {
    await patchPosts(data.data)
    isStopScroll.value = false
  }

  closeLoading()
}
getPosts()

// 載入更多
const scrollLoading = async () => {
  if (isStopScroll.value) return
  const { top } = loadDetector.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  if (!isStopScroll.value && top < windowHeight && !isLoaded.value) {
    await getPosts()
  }
}

onMounted(() => {
  window.addEventListener('scroll', scrollLoading)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollLoading)
  resetPosts()
  postPage.value = 1
  isLoaded.value = false
  isStopScroll.value = false
})
</script>

<style scoped lang="scss">
.posts {
  width: 100%;
}
</style>
