<template>
  <div class="main-header">
    <div class="container">
      <div class="logo main-title small">
        <router-link to="/">
          SpaceRoom
        </router-link>
      </div>
      <div class="other">
        <div class="quick-icon">
          <a
            href="javascript:;"
            class="color-switch"
          >
            <i
              v-if="darkMode"
              class="fa-solid fa-moon"
            />
            <i
              v-else
              class="fa-solid fa-sun"
            />
          </a>
          <a
            href="javascript:;"
            @click.prevent="noticeSwitch(true)"
          >
            <i class="fa-solid fa-bell" />
          </a>
        </div>
        <div
          class="bars"
          @click="menuSwitch(true)"
        >
          <i class="fa-solid fa-bars" />
        </div>
      </div>
    </div>
  </div>
  <!-- 主選單 -->
  <div
    class="bars-content menu"
    :class="{ active: menuShow }"
    @click="menuSwitch(false)"
  >
    <div class="bars-inner">
      <div>
        <div
          class="close-button"
          @click="menuSwitch(false)"
        >
          <i class="fa-solid fa-xmark" />
        </div>
        <div class="user-photo-outer">
          <UserPhoto :photo="avatar" />
        </div>
        <div class="name">
          {{ name }}
        </div>
        <ul @click="menuSwitch(false)">
          <li>
            <router-link :to="`/user/info/${userStore.user_id}`">
              個人資料
            </router-link>
          </li>
          <li>
            <router-link to="/user/update">
              編輯個人資料
            </router-link>
          </li>
          <li>
            <router-link :to="`/user/likes/${userStore.user_id}`">
              我收藏的貼文
            </router-link>
          </li>
          <li>
            <router-link :to="`/user/comments/${userStore.user_id}`">
              我留言的貼文
            </router-link>
          </li>
          <li>
            <router-link to="/user/more">
              找朋友
            </router-link>
          </li>
          <li>
            <router-link
              to="/auth"
              @click="logoutAuth"
            >
              登出
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- 通知 -->
  <div
    class="bars-content notice"
    :class="{ active: noticeShow }"
    @click="noticeSwitch(false)"
  >
    <div class="bars-inner">
      <div>
        <div
          class="close-button"
          @click="noticeSwitch(false)"
        >
          <i class="fa-solid fa-xmark" />
        </div>
        <div class="name">
          通知
        </div>
        <ul
          v-if="noticeNew?.length"
          @click="noticeSwitch(false)"
        >
          <li
            v-for="(notice, index) in noticeNew"
            :key="index + 'notice'"
          >
            <router-link
              v-if="notice.type === 'post'"
              :to="`/post/${notice.post_id}`"
            >
              <div class="top">
                <div class="type">
                  貼文
                </div>
                <div class="time">
                  {{ dateFormat(notice.time) }}
                </div>
              </div>
              <div class="bottom">
                {{ notice.name + '發佈了新貼文快去查看吧！' }}
              </div>
            </router-link>
            <router-link
              v-else-if="notice.type === 'comment'"
              :to="`/post/${notice.post_id}`"
            >
              <div class="top">
                <div class="type">
                  留言
                </div>
                <div class="time">
                  {{ dateFormat(notice.time) }}
                </div>
              </div>
              <div class="bottom">
                {{ notice.name + '新增了留言快去查看吧！' }}
              </div>
            </router-link>
            <router-link
              v-else-if="notice.type === 'follow'"
              :to="`/user/followers/${user_id}`"
            >
              <div class="top">
                <div class="type">
                  追蹤
                </div>
                <div class="time">
                  {{ dateFormat(notice.time) }}
                </div>
              </div>
              <div class="bottom">
                {{ notice.name + '追蹤了你！' }}
              </div>
            </router-link>
          </li>
        </ul>
        <ul v-else>
          <li>
            <div class="top" />
            <div class="bottom">
              目前無新的通知
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'
import { getUserNotice } from '@/fetch/fetch'
import { dateFormat } from '@/services/helper'
import router from '@/router/index'

const userStore = useUserStore()
const modalStore = useModalStore()
const { user_id, avatar, name } = storeToRefs(userStore)
const { logoutAuth } = userStore
const { lockScroll, unLockScroll, openLoading, closeLoading } = modalStore

// 主選單切換
const menuShow = ref(false)
const menuSwitch = (type) => {
  if (type) {
    menuShow.value = type
    lockScroll()
  } else {
    menuShow.value = type
    unLockScroll()
  }
}

// 通知資料
const noticeNew = ref([])
const getNotice = async () => {
  if (localStorage.getItem('notice') !== null) {
    noticeNew.value = Object.assign([], JSON.parse(localStorage.getItem('notice')))
  } else {
    openLoading()
  }

  const { data: noticeData } = await getUserNotice()

  noticeNew.value.length = 0

  const checkTime = (time) => Math.abs(new Date(time) - new Date()) < 1000 * 60 * 60 * 24 * 7

  noticeData.data.postData.forEach((post) => {
    if (checkTime(post.createdAt)) {
      noticeNew.value.push({
        post_id: post._id,
        name: post.user.name,
        time: post.createdAt,
        type: 'post'
      })
    }
  })

  noticeData.data.followerData.forEach((follower) => {
    if (checkTime(follower.createdAt)) {
      noticeNew.value.push({
        user_id: follower.user._id,
        name: follower.user.name,
        time: follower.createdAt,
        type: 'follow'
      })
    }
  })

  noticeData.data.commentsData.forEach((comment) => {
    if (checkTime(comment.createdAt)) {
      noticeNew.value.push({
        post_id: comment.post,
        name: comment.user.name,
        time: comment.createdAt,
        type: 'comment'
      })
    }
  })

  noticeData.data.repliesData.forEach((reply) => {
    if (checkTime(reply.createdAt)) {
      noticeNew.value.push({
        post_id: reply.post,
        name: reply.user.name,
        time: reply.createdAt,
        type: 'comment'
      })
    }
  })

  noticeNew.value = noticeNew.value.sort(function (a, b) {
    return b.time - a.time
  })

  localStorage.setItem('notice', JSON.stringify(noticeNew.value))
  closeLoading()
}

// 通知選單切換
const noticeShow = ref(false)
const noticeSwitch = (type) => {
  if (type) {
    getNotice()
    noticeShow.value = type
    lockScroll()
  } else {
    noticeShow.value = type
    unLockScroll()
  }
}

const darkMode = ref(false)
onMounted(() => {
  // 滾軸事件
  const target = document.querySelector('.main-header')
  const scrollUp = 'scroll-up'
  const scrollDown = 'scroll-down'
  let lastScroll = 0
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset
    if (currentScroll <= 0) {
      target.classList.remove(scrollUp)
      return
    }
    if (currentScroll > lastScroll && !target.classList.contains(scrollDown)) {
      // down
      target.classList.remove(scrollUp)
      target.classList.add(scrollDown)
    } else if (currentScroll < lastScroll && target.classList.contains(scrollDown)) {
      // up
      target.classList.remove(scrollDown)
      target.classList.add(scrollUp)
    }
    lastScroll = currentScroll
  })

  // 暗黑模式切換
  const body = document.querySelector('body')
  const colorSwitch = document.querySelector('.color-switch')
  darkMode.value = body.classList.contains('dark-theme')
  colorSwitch.addEventListener('click', () => {
    if (darkMode.value) {
      body.classList.remove('dark-theme')
      body.classList.add('light-theme')
    } else {
      body.classList.remove('light-theme')
      body.classList.add('dark-theme')
    }
    darkMode.value = !darkMode.value
  })

  document.querySelector('.bars-content.notice .bars-inner').addEventListener('click', function (e) {
    e.stopPropagation()
  })
  document.querySelector('.bars-content.menu .bars-inner').addEventListener('click', function (e) {
    e.stopPropagation()
  })
})

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    const target = document.querySelector('.main-header')
    target.classList.remove('scroll-down')
    target.classList.remove('scroll-up')
  }
)
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  color: var(--dark);
  transition: transform 0.4s;
  z-index: 20;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--light);
    opacity: 0.7;
    box-shadow: 0 2px 10px var(--dark2);
    z-index: 0;
    backdrop-filter: blur(3px);
    content: '';
  }

  &.scroll-up {
    transform: translateY(0);
  }

  &.scroll-down {
    transform: translateY(-100%);
  }
}

.container {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 12px 50px;
  z-index: 1;

  @include pad {
    padding: 12px 15px;
  }
}

.other {
  display: flex;
  align-items: center;
}

.main-title {
  margin-bottom: 5px;
}

.quick-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 25px;

  a {
    display: inline-block;
    margin-right: 12px;
    font-size: px(18);
    font-weight: $medium;
    transition: 0.4s;

    &:hover {
      color: $c-first;
    }

    &:last-child {
      margin: 0;
    }
  }

  @include pad {
    margin-right: 15px;

    a {
      margin-right: 8px;
    }
  }
}

.bars {
  i {
    position: relative;
    font-size: px(25);
    user-select: none;
    cursor: pointer;
    transition: 0.4s;
    flex-shrink: 0;

    &:hover {
      color: $c-first;
    }
  }
}

.bars-content {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 21;

  &.active {
    opacity: 1;
    pointer-events: all;
    transition: opacity 0.4s;

    .bars-inner {
      opacity: 1;
      transform: translateX(0);
      transition: opacity 0.4s 0.2s, transform 0.4s 0.2s;
    }
  }

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($c-black, 0.4);
    content: '';
  }

  .bars-inner {
    position: relative;
    padding: 10vh 20px;
    width: 90%;
    max-width: 300px;
    color: var(--dark);
    background-color: var(--light2);
    opacity: 0;
    overflow-y: auto;
    transition: opacity 0.2s, transform 0.2s;
    z-index: 1;
    transform: translateX(100%);

    >div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }

  .name {
    position: relative;
    margin-top: 15px;
    margin-bottom: 60px;
    font-size: px(20);
    font-weight: $medium;

    &::after {
      position: absolute;
      bottom: -30px;
      left: 50%;
      width: 40px;
      height: 4px;
      background-color: $c-first;
      content: '';
      transform: translateX(-50%);
    }
  }
}

.bars-content.menu {
  .user-photo-outer {
    margin: 0;
    margin-top: 30px;
    width: 60px;
    height: 60px;
  }

  ul {
    padding: 10px 0;
    width: 100%;
    height: 100%;
    color: var(--dark);
    background-color: var(--light);
    border-radius: 6px;
  }

  a {
    display: block;
    margin: 0 auto;
    padding: 10px 15px;
    font-size: px(16);
    text-align: center;
    user-select: none;
    cursor: pointer;
    transition: 0.4s;

    &:hover {
      color: $c-first;
    }
  }
}

.bars-content.notice {
  .name {
    margin-top: 25px;
  }

  ul {
    width: 100%;
  }

  li {
    color: var(--dark);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 5px var(--dark2);

    &:not(:last-child) {
      margin-bottom: 15px;
    }
  }

  a {
    display: block;
    width: 100%;
    height: 100%;
    user-select: none;
    cursor: pointer;
  }

  .top {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    width: 100%;
    font-size: px(12);
    font-weight: $medium;
    color: var(--light);
    background-color: $c-first;
  }

  .bottom {
    padding: 8px 12px;
    width: 100%;
    font-size: px(14);
    background-color: var(--light);
  }
}
</style>
