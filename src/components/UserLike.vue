<template>
  <div class="user-like">
    <div class="common-title" data-aos="fade" data-aos-delay="800">
      <p v-if="user_id === nowUser._id">我收藏的貼文</p>
      <p v-else>{{ nowUser.name }} 收藏的貼文</p>
    </div>
    <div class="show-lists">
      <ul>
        <template v-if="postsData?.length">
          <li v-for="data in postsData" :key="data._id" data-aos="fade">
            <div class="info">
              <div class="user-photo-outer">
                <UserPhoto :photo="data.user.avatar" />
              </div>
              <div class="user">
                <div class="name">
                  {{ data.user.name }}
                </div>
                <div class="time">發文時間： {{ dateFormat(data.createdAt) }}</div>
              </div>
            </div>
            <div class="tool">
              <!-- 收藏 -->
              <div
                v-if="user_id === nowUser._id"
                class="heart"
                :class="{ liked: data.isLiked }"
                @click.stop="patchLikesHandler(data)"
              >
                <svg
                  class="heart-small red"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"
                  />
                </svg>
                <svg
                  class="heart-small black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6.28 3c3.236.001 4.973 3.491 5.72 5.031.75-1.547 2.469-5.021 5.726-5.021 2.058 0 4.274 1.309 4.274 4.182 0 3.442-4.744 7.851-10 13-5.258-5.151-10-9.559-10-13 0-2.676 1.965-4.193 4.28-4.192zm.001-2c-3.183 0-6.281 2.187-6.281 6.192 0 4.661 5.57 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-4.011-3.097-6.182-6.274-6.182-2.204 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248z"
                  />
                </svg>
              </div>
              <!-- 查看 -->
              <router-link :to="`/post/${data._id}`">
                <div class="look-more">
                  <i class="fa-solid fa-circle-arrow-right" />
                </div>
              </router-link>
            </div>
          </li>
        </template>
        <template v-else>
          <li class="no-data" data-aos="fade" data-aos-delay="1200">目前尚無收藏的貼文！</li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { storeToRefs } from 'pinia'
import { ref, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { dateFormat } from '@/services/helper'
import { getUserInfo, getLikePosts, patchPostLikes } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const userStore = useUserStore()
const { user_id } = storeToRefs(userStore)
const { openAlert, openLoading, closeLoading } = modalStore

const postsData = ref([])
const nowUser = ref([])

const getLikePostsHandler = async (params_id) => {
  if (localStorage.getItem('postlikes') !== null) {
    postsData.value = Object.assign([], JSON.parse(localStorage.getItem('postlikes')))
  } else {
    openLoading()
  }
  const { data: userData } = await getUserInfo(params_id)
  nowUser.value = userData.data
  const { data } = await getLikePosts(params_id)
  if (!data.data) router.push('/notfound')
  postsData.value.length = 0
  postsData.value = Object.assign([], data.data)
  postsData.value.forEach((post) => {
    post.isLiked = true
  })
  localStorage.setItem('postlikes', JSON.stringify(postsData.value))
  closeLoading()
}

getLikePostsHandler(route.params.user_id)

watch(
  () => route.params.user_id,
  () => {
    const rule = router.currentRoute.value.fullPath.startsWith('/user/likes/')
    if (!rule) return false
    getLikePostsHandler(route.params.user_id)
  }
)

const patchLikesHandler = async (post) => {
  const mode = post.isLiked ? 'remove' : 'add'

  if (post.isLiked) openLoading('取消收藏中！')
  else openLoading('幫您收藏中！')

  // 更新狀態
  await patchPostLikes(post._id, mode)
  post.isLiked = !post.isLiked
  const aryIndex = postsData.value.findIndex((s) => s._id === post._id)
  if (aryIndex > -1) postsData.value.splice(aryIndex, 1)

  closeLoading()

  if (post.isLiked) openAlert('success', '已收藏！')
  else openAlert('error', '已取消收藏！')
}

onBeforeUnmount(() => {
  postsData.value.length = 0
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.look-more,
.heart {
  user-select: none;
  cursor: pointer;
}

.look-more {
  margin-left: 10px;
  font-size: px(24);
}
</style>
