<template>
  <div class="search-bar">
    <div class="common-title" data-aos="fade" data-aos-delay="800">搜尋</div>
    <div class="base-tools" data-aos="fade" data-aos-delay="1000">
      <FilterSort v-if="nowSwitch === 1" />
      <SearchBar />
    </div>
    <div class="tool" data-aos="fade" data-aos-delay="1000">
      <router-link class="back" to="/">
        <i class="fa-solid fa-circle-arrow-left" />
      </router-link>
      <div class="tabs">
        <div class="tab" :class="{ active: nowSwitch === 1 }" @click="switchPage(1)">貼文</div>
        <div class="tab" :class="{ active: nowSwitch === 2 }" @click="switchPage(2)">使用者</div>
      </div>
    </div>
    <div class="search-content">
      <div class="contents">
        <div v-show="nowSwitch === 1" class="content">
          <template v-if="posts.length">
            <PostItem v-for="post in posts" :key="post._id" :post="post" />
          </template>
          <template v-else>
            <PostItem :post="{}" />
          </template>
        </div>
        <div v-show="nowSwitch === 2" class="content">
          <div class="users">
            <template v-if="users.length">
              <UserItem v-for="user in users" :key="user._id" :user="user" />
            </template>
            <template v-else>
              <UserItem :user="{}" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PostBox />
</template>

<script setup>
import UserItem from '@/components/UserItem.vue'
import PostItem from '@/components/PostItem.vue'
import PostBox from '@/components/box/PostBox.vue'
import SearchBar from '@/components/SearchBar.vue'
import FilterSort from '@/components/FilterSort.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { getPostsByRoute, getUsersByRoute } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const modalStore = useModalStore()
const postStore = usePostStore()
const userStore = useUserStore()

const { posts } = storeToRefs(postStore)
const { user_id } = storeToRefs(userStore)
const { openLoading, closeLoading } = modalStore
const { patchPosts, resetPosts } = postStore

const nowSwitch = ref(1)
const users = ref([])

// 取得所有貼文
const getData = async () => {
  resetPosts()
  users.value.length = 0
  switch (nowSwitch.value) {
    case 1: {
      if (posts.value?.length || !route.query.q) return
      openLoading()
      const { data: postsData } = await getPostsByRoute(route.query)
      await patchPosts(postsData.data)
      closeLoading()
      break
    }
    case 2: {
      if (users.value?.length || !route.query.q) return
      openLoading()
      const { data: usersData } = await getUsersByRoute(route.query)
      const checkSelf = usersData.data.findIndex((user) => user._id === user_id.value)
      if (checkSelf > -1) usersData.data.splice(checkSelf, 1)
      users.value = usersData.data
      closeLoading()
    }
  }
}
getData()

// 切換頁籤
const switchPage = (n) => {
  if (n === nowSwitch.value) return
  nowSwitch.value = n
  getData()
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.tool {
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 25px;
  width: 100%;

  .back {
    margin-right: 30px;
    font-size: px(24);
    color: var(--dark);
    user-select: none;
    cursor: pointer;
    flex-shrink: 0;
  }

  .tabs {
    display: flex;
    align-items: stretch;
    margin: 0 auto;
    width: 100%;
  }

  .tab {
    margin-right: 10px;
    padding: 10px 15px;
    color: var(--dark);
    background-color: var(--light);
    border: 2px solid var(--dark);
    border-radius: 8px;
    user-select: none;
    cursor: pointer;
    transition: 0.5s;

    &.active {
      color: var(--light);
      background-color: var(--dark);
    }
  }
}

.users {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
</style>
