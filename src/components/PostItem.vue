<template>
  <div v-if="hasData" class="post" data-aos="fade-up">
    <div class="content">
      <div class="top">
        <router-link :to="`/user/info/${props.post.user._id}`">
          <div class="user-photo-outer">
            <UserPhoto :photo="props.post.user.avatar" />
          </div>
          <div class="user-name">
            <p>{{ props.post.user.name }}</p>
            <p>{{ dateFormat(props.post.createdAt) }}</p>
          </div>
        </router-link>
        <div v-if="props.post.user._id === userStore.user_id" class="post-control">
          <i class="fa-solid fa-ellipsis" @click.stop="showPostControl = !showPostControl" />
          <div v-if="showPostControl">
            <ul>
              <li @click="openPostUploadBox(true, props.post)">編輯貼文</li>
              <li @click="deletePostHandler(props.post)">刪除貼文</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="middle">
        <div class="inner-t serEditorCss">
          <!-- eslint-disable vue/no-v-html -->
          <div v-html="props.post.content" />
          <!--eslint-enable-->
        </div>
        <div v-if="props.post.images?.length" class="inner-photo">
          <div v-if="props.post.images[0]?.link" class="img-control">
            <img v-lazy="props.post.images[0].link" alt="" />
          </div>
          <div v-if="props.post.images[1]?.link" class="img-control">
            <img v-lazy="props.post.images[1].link" alt="" />
          </div>
          <div v-if="props.post.images[2]?.link" class="img-control">
            <img v-lazy="props.post.images[2].link" alt="" />
          </div>
          <div v-if="props.post.images?.length >= 2" class="img-more" @click="openImagesBox(true, props.post.images)">
            <p>查看更多 ...</p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <PostTool :post="props.post" />
        <CommentWall :comments="props.post.comments" />
      </div>
    </div>
  </div>
  <div v-else class="no-data" data-aos="fade" data-aos-delay="1200">
    <div class="top-bar">
      <div />
      <div />
      <div />
    </div>
    <div class="no-t">目前尚無貼文！</div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import CommentWall from '@/components/CommentWall.vue'
import PostTool from '@/components/PostTool.vue'
import { ref, onMounted } from 'vue'
import { dateFormat } from '@/services/helper'
import { deleteOnePost, deleteUploadImage } from '@/fetch/fetch'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
const userStore = useUserStore()
const postStore = usePostStore()
const { openLoading, closeLoading, openAlert, openPostUploadBox, openImagesBox } = modalStore
const { deletePost } = postStore

const props = defineProps({
  post: Object
})

// 確認是否有資料
const hasData = ref(null)
hasData.value = Object.keys(props.post).length !== 0

// 控制視窗
const showPostControl = ref(false)

// 刪除貼文
const deletePostHandler = async (post) => {
  openLoading('刪除貼文中')
  for await (const image of post.images) {
    await deleteUploadImage(image.hash)
  }
  await deleteOnePost(post._id)
  await deletePost(post._id)
  closeLoading()
  openAlert('success', '刪除貼文成功！')
}

onMounted(() => {
  document.body.addEventListener('click', (e) => {
    if (!e.target.classList.contains('post-control') && !e.target.closest('.post-control')) {
      showPostControl.value = false
    }
  })
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.post {
  padding: 25px 22px;
  width: 100%;
  color: var(--dark);
  background-color: var(--light);
  border: 2px solid var(--dark);
  border-radius: 8px;
  box-shadow: 0 3px 5px rgb(var(--dark) 0.3);
  border-bottom: 4px solid var(--dark);

  &:not(:first-child) {
    margin-top: 25px;
  }

  @include mobile {
    padding: 25px 15px;
  }
}

.content {
  width: 100%;
  min-height: 100px;
}

.top {
  display: flex;
  align-items: flex-start;

  a {
    display: inline-flex;
    align-items: flex-start;

    &:hover {
      p:nth-child(1) {
        color: $c-first;
      }
    }
  }

  p:nth-child(1) {
    margin-top: 5px;
    font-size: px(16);
    font-weight: $medium;
  }

  p:nth-child(2) {
    margin-top: 8px;
    font-size: px(12);
    color: var(--gray);
  }
}

.post-control {
  position: relative;
  margin-left: auto;
  user-select: none;
  cursor: pointer;

  > i {
    font-size: px(25);
  }

  > div {
    position: absolute;
    top: 22px;
    right: 0;
    width: auto;
    height: auto;
    z-index: 5;
  }

  ul {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px var(--dark);
  }

  li {
    padding: 10px 15px;
    width: 100%;
    color: var(--light);
    background-color: var(--gray);
    white-space: nowrap;
    transition: background-color 0.6s;

    &:hover {
      background-color: var(--gray2);
    }
  }

  @include mobile {
    li {
      padding: 8px 10px;
      font-size: px(14);
    }
  }
}

.middle {
  margin-top: 15px;
  padding-left: 10px;
  width: 100%;
  min-height: 150px;
}

.inner-t {
  font-size: px(14);
  letter-spacing: 1.2px;
  line-height: 1.4;
}

.inner-photo {
  display: flex;
  align-items: stretch;
  margin-top: 10px;

  .img-control {
    position: relative;
    margin: 5px;
    width: 33.333%;
    border: 2px solid var(--dark);
    border-radius: 10px;
    overflow: hidden;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    &:only-child {
      width: 60%;
    }
  }

  .img-more {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    padding: 10px;
    color: var(--dark);
    border-radius: 10px;
    user-select: none;
    cursor: pointer;
    align-self: flex-end;
    flex-direction: column;
    flex-shrink: 0;

    p {
      font-size: px(12);
      font-weight: $medium;
      letter-spacing: 1.2px;
    }
  }

  @include mobile {
    flex-wrap: wrap;

    .img-control {
      width: calc(50% - 10px);
    }
  }
}

.bottom {
  width: 100%;
}
</style>
