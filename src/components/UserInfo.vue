<template>
  <div class="user-info">
    <div class="top-info" data-aos="fade-up" data-aos-delay="1000">
      <div class="status">
        <div class="base">
          <div class="user-photo-outer">
            <UserPhoto :photo="nowUser.avatar" />
          </div>
          <div class="now-user">
            <div class="name">
              {{ nowUser.name }}
            </div>
            <div class="create">創立日期： {{ dateFormat(nowUser.createdAt) }}</div>
          </div>
        </div>
        <div class="detail">
          <div class="now-posts">
            <span>貼文</span>
            <p>{{ posts?.length }}</p>
          </div>
          <div class="followers">
            <router-link :to="`/user/followings/${route.params.user_id}`">
              <span>追蹤中</span>
              <p>{{ nowUser.followings?.length }}</p>
            </router-link>
          </div>
          <div class="followings">
            <router-link :to="`/user/followers/${route.params.user_id}`">
              <span>粉絲</span>
              <p>{{ nowUser.followers?.length }}</p>
            </router-link>
          </div>
        </div>
      </div>
      <router-link v-if="user_id === nowUser._id" class="base-button file" to="/user/update">
        編輯個人檔案
      </router-link>
      <div class="tool">
        <template v-if="user_id !== nowUser._id">
          <button v-if="followMode" class="base-button" type="button" @click="patchFollowsHandler(nowUser._id)">
            取消追蹤
          </button>
          <button v-else class="base-button" type="button" @click="patchFollowsHandler(nowUser._id)">追蹤</button>
        </template>
      </div>
    </div>
    <div class="bottom-posts" data-aos="fade" data-aos-delay="1500">
      <template v-if="posts?.length">
        <PostItem v-for="post in posts" :key="post._id" :post="post" />
      </template>
      <template v-else>
        <PostItem :post="{}" />
      </template>
      <PostBox />
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import PostItem from '@/components/PostItem.vue'
import PostBox from '@/components/box/PostBox.vue'
import { storeToRefs } from 'pinia'
import { ref, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { dateFormat } from '@/services/helper'
import { getUserProfile, patchFollows } from '@/fetch/fetch'
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
const { openAlert, openLoading, closeLoading } = modalStore
const { patchPosts, resetPosts } = postStore

const nowUser = ref([])
const followMode = ref(false)

const getInfoHandler = async (params_id) => {
  openLoading()
  const { data: profileData } = await getUserProfile(params_id)
  if (!profileData.data.user) router.push('/notfound')
  nowUser.value = profileData.data.user
  followMode.value = nowUser.value.followers.some((item) => item.user === user_id.value)
  if (!profileData.data.post) router.push('/notfound')
  await patchPosts(profileData.data.post)
  closeLoading()
}

getInfoHandler(route.params.user_id)

watch(
  () => route.params.user_id,
  () => {
    const rule = router.currentRoute.value.fullPath.startsWith('/user/info/')
    if (!rule) return false
    getInfoHandler(route.params.user_id)
  }
)

onBeforeUnmount(() => {
  nowUser.value = []
  resetPosts()
})

// 追蹤功能
const patchFollowsHandler = async (params_id) => {
  openLoading()
  const mode = followMode.value ? 'unfollow' : 'follow'

  // 更新狀態
  await patchFollows(params_id, mode)

  if (mode === 'unfollow') {
    const aryIndex = nowUser.value.followers.findIndex((s) => s.user === user_id)
    nowUser.value.followers.splice(aryIndex, 1)
  } else {
    nowUser.value.followers.push(user_id)
  }

  followMode.value = !followMode.value

  closeLoading()

  if (mode === 'unfollow') {
    openAlert('success', '已取消追蹤！')
  } else {
    openAlert('success', '已追蹤！')
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.top-info {
  position: relative;
  padding: 25px 25px 30px;
  width: 100%;
  color: var(--dark);
  border-radius: 8px 8px 15px 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px var(--dark);

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--light2);
    opacity: 0.7;
    z-index: 0;
    backdrop-filter: blur(3px);
    content: '';
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @include mobile {
    padding: 20px 15px 15px;
  }
}

.status {
  display: flex;
  width: 100%;
}

.base {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;

  .user-photo-outer {
    margin-right: 0;
    margin-bottom: 10px;
    width: 55px;
    height: 55px;
  }

  .now-user {
    padding-left: 5px;
  }

  .name {
    font-size: px(18);
    font-weight: $medium;
  }

  .create {
    margin-top: 8px;
    font-size: px(12);
    color: var(--gray);
  }

  @include mobile {
    .create {
      display: none;
    }
  }
}

.detail {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 15px;
  width: 100%;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-direction: column;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex-direction: column;
    }

    span {
      font-size: px(14);
      font-weight: $medium;
    }

    p {
      margin-top: 8px;
      font-size: px(18);
      font-weight: $medium;
    }
  }

  @include mobile {
    padding-left: 10px;
  }
}

.tool {
  display: flex;
  margin-top: 20px;
  width: 100%;
}

.base-button {
  &:not(:first-child) {
    margin-left: 10px;
  }
}

.base-button.file {
  margin: 0;
  margin-top: 25px;
}

.bottom-posts {
  margin-top: 50px;
}
</style>
