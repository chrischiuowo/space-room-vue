<template>
  <div class="post-only">
    <div class="tool">
      <a class="back" @click.prevent="router.back()">
        <i class="fa-solid fa-circle-arrow-left" />
      </a>
    </div>
    <template v-if="posts?.length">
      <PostItem v-for="post in posts" :key="post._id" :post="post" />
    </template>
    <template v-else>
      <PostItem :post="{}" />
    </template>
  </div>
  <PostBox />
</template>

<script setup>
import PostItem from '@/components/PostItem.vue'
import PostBox from '@/components/box/PostBox.vue'
import { onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { getPostOnly } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const postStore = usePostStore()
const { posts } = storeToRefs(postStore)
const { openLoading, closeLoading } = modalStore
const { addPosts, resetPosts } = postStore

const getPostHandler = async (post_id) => {
  openLoading()
  const { data } = await getPostOnly(post_id)
  if (!data.data) router.push('/notfound')
  await addPosts(data.data)
  closeLoading()
}

getPostHandler(route.params.post_id)

watch(
  () => route.params.post_id,
  () => {
    const rule = router.currentRoute.value.fullPath.startsWith('/post/')
    if (!rule) return false
    getPostHandler(route.params.post_id)
  }
)

onBeforeUnmount(() => {
  resetPosts()
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.tool {
  margin-bottom: 20px;
  width: 100%;

  .back {
    font-size: px(24);
    color: var(--dark);
    user-select: none;
    cursor: pointer;
  }
}
</style>
