<template>
  <aside class="side-bar" data-aos="fade-up" data-aos-delay="1000">
    <div class="container">
      <button class="base-button blue" type="button" @click="openPostUploadBox(true)">新增動態</button>
      <ul>
        <li>
          <router-link :to="`/user/info/${userStore.user_id}`">
            <div class="circle">
              <div class="user-photo-outer">
                <UserPhoto :photo="userStore.avatar" />
              </div>
            </div>
            <p v-if="userStore.name">
              {{ userStore.name }}
            </p>
            <p v-else>使用者名稱</p>
          </router-link>
        </li>
        <li>
          <router-link :to="`/user/likes/${userStore.user_id}`">
            <div class="circle">
              <i class="fa-solid fa-heart" />
            </div>
            <p>我收藏的貼文</p>
          </router-link>
        </li>
        <li>
          <router-link :to="`/user/comments/${userStore.user_id}`">
            <div class="circle">
              <i class="fa-solid fa-comment" />
            </div>
            <p>我留言的貼文</p>
          </router-link>
        </li>
        <li>
          <router-link to="/user/more">
            <div class="circle">
              <i class="fa-solid fa-user" />
            </div>
            <p>找朋友吧</p>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>

  <aside class="mobile-bar" data-aos="fade" data-aos-delay="1000">
    <ul>
      <li>
        <router-link to="/">
          <i class="fa-solid fa-house" />
          <p>首頁</p>
        </router-link>
      </li>
      <li>
        <router-link to="/search">
          <i class="fa-solid fa-magnifying-glass" />
          <p>搜尋</p>
        </router-link>
      </li>
      <li class="add">
        <a href="javascript:;" @click.prevent="openPostUploadBox(true)">
          <i class="fa-solid fa-circle-plus" />
        </a>
      </li>
      <li>
        <router-link :to="`/user/likes/${userStore.user_id}`">
          <i class="fa-solid fa-heart" />
          <p>收藏</p>
        </router-link>
      </li>
      <li>
        <router-link :to="`/user/info/${userStore.user_id}`">
          <i class="fa-solid fa-user" />
          <p>個人</p>
        </router-link>
      </li>
    </ul>
  </aside>

  <Transition name="fade-model">
    <PostUploadBox v-if="showPostUploadBox" />
  </Transition>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import PostUploadBox from '@/components/box/PostUploadBox.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'

const userStore = useUserStore()
const modalStore = useModalStore()
const { showPostUploadBox } = storeToRefs(modalStore)
const { openPostUploadBox } = modalStore
</script>

<style scoped lang="scss">
@import '../assets/scss/base/variables';
@import '../assets/scss/base/mixins';

.side-bar {
  position: sticky;
  top: 40px;
  margin-right: 30px;
  padding: 30px 20px 20px;
  width: 100%;
  max-width: 300px;
  color: var(--dark);
  background-color: var(--light);
  border: 2px solid var(--dark);
  border-radius: 8px 8px 15px 15px;
  border-bottom: 4px solid var(--dark);

  > .container {
    width: 100%;
  }

  li {
    width: 100%;

    &:first-child {
      margin: 25px 0 15px;
    }

    &:not(:first-child) {
      margin: 15px 0;
    }

    a {
      display: flex;
      align-items: center;
      width: 100%;

      &:hover {
        color: $c-first;
      }
    }

    .circle {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      width: 50px;
      height: 50px;
      color: $c-black;
      background-color: $c-second;
      border: 2px solid var(--dark);
      border-radius: 50%;
      overflow: hidden;
    }

    .user-photo-outer {
      border: unset;
    }

    i {
      font-size: px(20);
    }
  }

  @include pad {
    display: none;
  }
}

.mobile-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  display: none;
  width: 100vw;
  background-color: $c-white;
  border: 2px solid $c-black;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
  z-index: 20;

  ul {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  li {
    width: 100%;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      width: 100%;
      height: 100%;
      flex-direction: column;

      &.router-link-exact-active {
        color: $c-white;
        background-color: $c-first;
      }
    }

    i {
      font-size: px(20);
    }

    p {
      margin-top: 10px;
      font-size: px(12);
    }

    &.add {
      a {
        animation: move 1.5s infinite alternate-reverse ease;
      }

      i {
        font-size: px(30);
      }
    }
  }

  @include pad {
    display: block;
  }

  @include mobile {
    li {
      i {
        font-size: px(18);
      }
    }
  }

  @include mobile-s {
    li {
      p {
        display: none;
      }
    }
  }

  @keyframes move {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-5px);
    }
  }
}

.user-photo-outer {
  margin: 0 !important;
}
</style>
