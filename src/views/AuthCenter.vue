<template>
  <MainHeader />
  <section class="auth-center">
    <div class="container-box">
      <SideBar />
      <div class="max">
        <router-view />
      </div>
    </div>
  </section>
</template>

<script setup>
import MainHeader from '@/components/MainHeader.vue'
import SideBar from '@/components/SideBar.vue'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { checkToken, getUserInfo } from '@/fetch/fetch'

// store 資料
const userStore = useUserStore()
const { patchUser } = userStore

// 取得個人資料
const getProfile = async () => {
  const { data: now_user } = await checkToken()
  const { data } = await getUserInfo(now_user.data._id)
  if (data.status) {
    patchUser({
      user_id: data.data._id,
      name: data.data.name,
      avatar: data.data.avatar
    })
  }
}

onMounted(async () => {
  if (!userStore.user_id) {
    await getProfile()
  }
})
</script>
›

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.auth-center {
  .container-box {
    align-items: flex-start;
    background-size: 80px 80px;
  }

  .max {
    width: 100%;
    max-width: 950px;
  }
}

body {
  &.light-theme {
    .auth-center {
      .container-box {
        background-color: var(--light2);
        background-image: linear-gradient(to right, rgb(0 0 0 / 25%) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(0 0 0 / 25%) 1px, transparent 1px);
      }
    }
  }

  &.dark-theme {
    .auth-center {
      .container-box {
        background-color: var(--light2);
        background-image: linear-gradient(to right, rgb(255 255 255 / 25%) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(255 255 255 / 25%) 1px, transparent 1px);
      }
    }
  }
}
</style>
