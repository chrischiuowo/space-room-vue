<template>
  <div v-if="comments" class="comments">
    <ul>
      <li v-for="comment in comments" :key="comment._id">
        <div class="div-wrap">
          <div class="user-photo-outer">
            <UserPhoto :photo="comment.user.avatar" />
          </div>
          <div class="comment-outer">
            <div>
              <router-link :to="`/user/info/${comment.user._id}`">
                <div class="name">
                  {{ comment.user.name }}
                </div>
                <div class="date">
                  {{ dateFormat(comment.createdAt) }}
                </div>
              </router-link>
            </div>
            <div class="comment">
              <!-- eslint-disable vue/no-v-html -->
              <div v-html="comment.content" />
              <!--eslint-enable-->
            </div>
            <div class="control-panel">
              <button type="button" @click="openCommentEditorBox(true, 'postReply', comment)">回覆</button>
              <button
                v-if="comment.user._id === userStore.user_id"
                type="button"
                @click="openCommentEditorBox(true, 'patchComment', comment)"
              >
                編輯
              </button>
              <button
                v-if="comment.user._id === userStore.user_id"
                type="button"
                @click="deleteCommentHandler(comment)"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
        <template v-if="comment.commentReplies">
          <div v-for="commonReply in comment.commentReplies" :key="commonReply._id" class="div-wrap2">
            <div class="user-photo-outer">
              <UserPhoto :photo="commonReply.user.avatar" />
            </div>
            <div class="comment-outer">
              <div>
                <router-link :to="`/user/likes/${commonReply.user._id}`">
                  <div class="name">
                    {{ commonReply.user.name }}
                  </div>
                  <div class="date">
                    {{ dateFormat(commonReply.createdAt) }}
                  </div>
                </router-link>
              </div>
              <div class="comment">
                <!-- eslint-disable vue/no-v-html -->
                <div v-html="commonReply.content" />
                <!--eslint-enable-->
              </div>
              <div v-if="commonReply.user._id === userStore.user_id" class="control-panel">
                <button type="button" @click="openCommentEditorBox(true, 'patchReply', commonReply)">編輯</button>
                <button type="button" @click="deleteReplyHandler(commonReply)">刪除</button>
              </div>
            </div>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { dateFormat } from '@/services/helper'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useModalStore } from '@/stores/modal'
import { deleteOneComment, deleteOneReply } from '@/fetch/fetch'

const userStore = useUserStore()
const postStore = usePostStore()
const modalStore = useModalStore()
const { deleteCommentData, deleteReplyData } = postStore
const { openLoading, closeLoading, openAlert, openCommentEditorBox } = modalStore

defineProps({
  comments: Array
})

// 刪除留言
const deleteCommentHandler = async (comment) => {
  openLoading('刪除留言中')
  await deleteOneComment(comment._id)
  await deleteCommentData(comment._id, comment.post)
  closeLoading()
  openAlert('success', '刪除留言成功！')
}

// 刪除回覆留言
const deleteReplyHandler = async (reply) => {
  openLoading('刪除回覆中')
  await deleteOneReply(reply._id)
  await deleteReplyData(reply._id, reply.comment, reply.post)
  closeLoading()
  openAlert('success', '刪除回覆成功！')
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.comments {
  position: relative;
  margin-top: 25px;
  padding-left: 40px;
  width: 100%;

  @include mobile {
    padding-left: 0;

    .user-photo-outer {
      width: 35px;
      height: 35px;
    }
  }
}

ul {
  width: 100%;
}

li {
  padding: 15px;
  width: 100%;
  background-color: var(--light2);
  border-radius: 10px;

  &:not(:first-child) {
    margin-top: 15px;
  }
}

.div-wrap {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.div-wrap2 {
  display: flex;
  align-items: flex-start;
  padding-top: 20px;
  padding-left: 50px;
  width: 100%;

  @include mobile {
    padding-left: 15px;
  }
}

.name {
  position: relative;
  font-size: px(14);
  font-weight: $medium;
}

.date {
  margin-top: 8px;
  font-size: px(12);
  color: var(--gray);
}

.comment-outer {
  width: 100%;

  a {
    display: inline-block;

    &:hover {
      .name {
        color: $c-first;
      }
    }
  }
}

.comment {
  margin-top: 12px;
  font-size: px(14);
  letter-spacing: 1.2px;
  line-height: 1.4;
}

.control-panel {
  display: flex;
  margin-top: 25px;
  width: 100%;

  button {
    font-weight: $medium;
    color: var(--gray);
    user-select: none;
    cursor: pointer;

    &:not(:first-child) {
      margin-left: 8px;
    }
  }
}
</style>
