<template>
  <div class="post-tool">
    <!-- 讚 -->
    <div>
      <div class="like" @click.stop="patchLikesHandler(props.post._id)">
        <div class="heart" :class="{ liked: isLiked }">
          <svg class="heart-small red" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"
            />
          </svg>
          <svg class="heart-small black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M6.28 3c3.236.001 4.973 3.491 5.72 5.031.75-1.547 2.469-5.021 5.726-5.021 2.058 0 4.274 1.309 4.274 4.182 0 3.442-4.744 7.851-10 13-5.258-5.151-10-9.559-10-13 0-2.676 1.965-4.193 4.28-4.192zm.001-2c-3.183 0-6.281 2.187-6.281 6.192 0 4.661 5.57 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-4.011-3.097-6.182-6.274-6.182-2.204 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248z"
            />
          </svg>
        </div>
        <p v-if="props.post.likes?.length" class="heart-num">
          {{ props.post.likes.length }}
        </p>
        <p v-else class="heart-num no">成為第一位收藏的人！</p>
      </div>
      <div v-if="props.post.likes?.length" class="look" @click="likesListHandler(props.post._id)">
        <i class="far fa-eye" />
      </div>
    </div>
    <!-- 留言 -->
    <div>
      <div class="user-photo-outer">
        <UserPhoto :photo="props.post.user.avatar" />
      </div>
      <div class="input-outer">
        <div class="comment-editor">
          <editor-content :editor="editor" />
        </div>
        <button type="button" @click="postCommentHandler(props.post._id)">留言</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { storeToRefs } from 'pinia'
import { postOneComment, getPostLikesList, patchPostLikes } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import { ref, computed } from 'vue'

const modalStore = useModalStore()
const postStore = usePostStore()
const userStore = useUserStore()
const { openLoading, closeLoading, openAlert, openPostLikesBox } = modalStore
const { addCommentData, patchPostLikesData } = postStore
const { user_id, name, avatar } = storeToRefs(userStore)

const props = defineProps({
  post: Object
})

// 收藏功能
const isLiked = computed(() => {
  return props.post.likes.some((item) => item === user_id.value)
})
const patchLikesHandler = async (post_id) => {
  const mode = isLiked.value ? 'remove' : 'add'

  if (isLiked.value) openLoading('取消收藏中！')
  else openLoading('幫您收藏中！')

  // 更新狀態
  const { data } = await patchPostLikes(post_id, mode)
  patchPostLikesData(post_id, data.data)

  closeLoading()

  if (isLiked.value) openAlert('success', '已收藏！')
  else openAlert('error', '已取消收藏！')
}

// 顯示收藏會員燈箱
const likesListHandler = async (post_id) => {
  openLoading()
  const { data } = await getPostLikesList(post_id)
  closeLoading()
  openPostLikesBox(true, data.data.post_list.likes)
}

// 新增一則留言
const commentData = ref({
  content: ''
})
const postCommentHandler = async (post_id) => {
  if (commentData.value.content === '<p></p>' || commentData.value.content === '') {
    openAlert('error', '填寫內容不得為空白！')
    return false
  }
  openLoading('新增留言中')
  const { data } = await postOneComment(post_id, commentData.value)
  commentData.value.content = ''
  editor.value.commands.clearContent()
  // 暫存當前使用者
  data.data.user = {
    _id: user_id.value,
    avatar: avatar.value,
    name: name.value
  }
  await addCommentData(data.data.post, data.data)
  closeLoading()
  openAlert('success', '新增成功')
}

// 編輯器處理
const editor = useEditor({
  content: commentData.value.content,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '留言 ...'
    })
  ],
  onUpdate: ({ editor }) => {
    commentData.value.content = editor.getHTML()
  }
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.post-tool {
  margin-top: 25px;
  padding-left: 15px;
  width: 100%;

  @include mobile {
    padding-left: 0;
  }
}

.post-tool > div:nth-child(1) {
  align-content: center;
  display: inline-flex;

  > div {
    display: inline-flex;
    user-select: none;
    cursor: pointer;
    align-content: center;
  }

  .look {
    margin-top: 12px;
    margin-left: 15px;
  }

  p {
    padding-top: 12px;
    padding-left: 2px;
    font-weight: $medium;

    &.no {
      font-size: px(14);
    }
  }
}

.post-tool > div:nth-child(2) {
  display: flex;
  align-items: stretch;
  margin-top: 20px;
  width: 100%;

  @include mobile {
    margin-top: 10px;

    .user-photo-outer {
      display: none;
    }
  }
}

.input-outer {
  display: flex;
  align-items: stretch;
  width: 100%;

  > div {
    width: calc(100% - 130px);
  }

  button {
    padding: 6px;
    width: 120px;
    height: 100%;
    font-size: px(18);
    font-weight: $medium;
    color: $c-white;
    background-color: $c-first;
    border: 2px solid var(--dark);
    user-select: none;
    cursor: pointer;
    transition: background-color 0.6s, color 0.2s, transform 0.4s;
    border-left: unset;
    flex-shrink: 0;

    &:hover {
      background-color: rgba($c-first, 0.95);
    }
  }

  @include mobile {
    > div {
      width: calc(100% - 70px);
    }

    button {
      width: 70px;
      font-size: px(12);
    }
  }
}
</style>
