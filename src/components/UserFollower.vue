<template>
  <div class="user-follower">
    <div class="common-title" data-aos="fade" data-aos-delay="800">
      <p v-if="user_id === nowUser._id">我的粉絲清單</p>
      <p v-else>{{ nowUser.name }} 的粉絲清單</p>
    </div>
    <div class="show-lists">
      <ul>
        <template v-if="usersData?.length">
          <li v-for="data in usersData" :key="data.user._id" data-aos="fade">
            <div class="info">
              <router-link :to="`/user/info/${data.user._id}`">
                <div class="user-photo-outer">
                  <UserPhoto :photo="data.user.avatar" />
                </div>
                <div class="user">
                  <div class="name">
                    {{ data.user.name }}
                  </div>
                  <div class="time">追蹤時間： {{ dateFormat(data.createdAt) }}</div>
                </div>
              </router-link>
            </div>
            <div v-if="user_id === nowUser._id" class="tool">
              <button class="base-button red" type="button" @click.stop="patchFollowsHandler(data.user)">移除</button>
            </div>
          </li>
        </template>
        <div v-else class="no-data" data-aos="fade" data-aos-delay="1200">
          <div class="top-bar">
            <div />
            <div />
            <div />
          </div>
          <div class="no-t">目前尚無粉絲！</div>
        </div>
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
import { getUserInfo, getFollowsList, patchFollows } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'

const route = useRoute()
// store 資料
const modalStore = useModalStore()
const userStore = useUserStore()
const { user_id } = storeToRefs(userStore)
const { openAlert, openLoading, closeLoading } = modalStore

const usersData = ref([])
const nowUser = ref([])

const getFollowsHandler = async (params_id) => {
  openLoading()
  const { data: userData } = await getUserInfo(params_id)
  nowUser.value = userData.data
  const { data } = await getFollowsList(params_id)
  if (!data.data) router.push('/notfound')
  usersData.value = data.data.followers
  closeLoading()
}

getFollowsHandler(route.params.user_id)

watch(
  () => route.params.user_id,
  () => {
    const rule = router.currentRoute.value.fullPath.startsWith('/user/followers/')
    if (!rule) return false
    getFollowsHandler(route.params.user_id)
  }
)

const patchFollowsHandler = async (user) => {
  openLoading()
  const mode = 'unfollow'

  // 更新狀態
  await patchFollows(user_id.value, mode, user._id)
  const aryIndex = usersData.value.findIndex((s) => s.user._id === user._id)
  if (aryIndex > -1) usersData.value.splice(aryIndex, 1)

  closeLoading()

  openAlert('success', '已移除粉絲！')
}

onBeforeUnmount(() => {
  usersData.value.length = 0
})
</script>

<style scoped lang="scss">
.base-button {
  min-width: 150px;
}
</style>
