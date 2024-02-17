<template>
  <div class="user-comment">
    <div class="common-title" data-aos="fade" data-aos-delay="800">
      <p v-if="user_id === nowUser._id">我留言的貼文</p>
      <p v-else>{{ nowUser.name }} 留言的貼文</p>
    </div>
    <div class="posts">
      <template v-if="posts?.length">
        <PostItem v-for="post in posts" :key="post._id" :post="post" />
      </template>
      <template v-else>
        <PostItem :post="{}" />
      </template>
    </div>
  </div>
  <PostBox />
</template>

<script setup>
import PostItem from '@/components/PostItem.vue'
import PostBox from '@/components/box/PostBox.vue'
import { storeToRefs } from 'pinia'
import { ref, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { getUserInfo, getCommentPosts } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const userStore = useUserStore()
const postStore = usePostStore()
const { user_id } = storeToRefs(userStore)
const { posts } = storeToRefs(postStore)
const { openLoading, closeLoading } = modalStore
const { patchPosts, resetPosts } = postStore

const nowUser = ref([])

const getCommentPostsHandler = async (params_id) => {
  openLoading()
  const { data: userData } = await getUserInfo(params_id)
  nowUser.value = userData.data
  const { data } = await getCommentPosts(params_id)
  if (!data.data) router.push('/notfound')
  patchPosts(data.data)
  closeLoading()
}

getCommentPostsHandler(route.params.user_id)

watch(
  () => route.params.user_id,
  () => {
    const rule = router.currentRoute.value.fullPath.startsWith('/user/comments/')
    if (!rule) return false
    getCommentPostsHandler(route.params.user_id)
  }
)

onBeforeUnmount(() => {
  resetPosts()
})
</script>
