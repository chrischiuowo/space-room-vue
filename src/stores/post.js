import { defineStore } from 'pinia'

// 利用 store 的資料 製作貼文相關暫存的功能
export const usePostStore = defineStore('postStore', {
  // data
  state: () => ({
    id: 'post',
    posts: [],
    // q => 搜尋項目
    // s => 資料排序
    routeQuery: {
      q: '',
      s: 'new'
    }
  }),
  // methods
  actions: {
    // 更新參數
    async patchQuery (data) {
      // 傳入陣列
      Object.assign(this.routeQuery, ...data)
    },
    // 新增貼文資料
    async addPosts (data) {
      // 傳入陣列
      this.posts.push(...data)
    },
    // 更新貼文陣列
    async patchPosts (data) {
      this.posts.length = 0
      Object.assign(this.posts, data)
    },
    // 重設貼文陣列
    async resetPosts () {
      this.posts.length = 0
    },
    // 更新單一貼文
    async patchPost (data) {
      const index = this.posts.findIndex((post) => post._id === data._id)
      Object.assign(this.posts[index], data)
    },
    // 刪除單一貼文
    async deletePost (post_id) {
      const postIndex = this.posts.findIndex((post) => post._id === post_id)
      this.posts.splice(postIndex, 1)
    },
    // 新增留言
    async addCommentData (post_id, data) {
      const index = this.posts.findIndex((post) => post._id === post_id)
      const ary = this.posts[index]
      console.log(ary)
      if (ary.comments) {
        ary.comments.unshift(data)
      } else {
        ary.comments = []
        ary.comments.push(data)
      }
    },
    // 編輯留言
    async patchCommentData (comment_id, post_id, data) {
      const postIndex = this.posts.findIndex((post) => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex((comment) => comment._id === comment_id)
      this.posts[postIndex].comments.splice(commentIndex, 1, data)
    },
    // 刪除留言
    async deleteCommentData (comment_id, post_id) {
      const postIndex = this.posts.findIndex((post) => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex((comment) => comment._id === comment_id)
      this.posts[postIndex].comments.splice(commentIndex, 1)
    },
    // 回覆留言
    async addReplyData (comment_id, post_id, data) {
      const postIndex = this.posts.findIndex((post) => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex((comment) => comment._id === comment_id)
      const ary = this.posts[postIndex].comments[commentIndex]
      if (ary.commentReplies) {
        ary.commentReplies.unshift(data)
      } else {
        ary.commentReplies = []
        ary.commentReplies.push(data)
      }
    },
    // 編輯回覆留言
    async patchReplyData (reply_id, comment_id, post_id, data) {
      const postIndex = this.posts.findIndex((post) => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex((comment) => comment._id === comment_id)
      const replyIndex = this.posts[postIndex].comments[commentIndex].commentReplies.findIndex(
        (reply) => reply._id === reply_id
      )
      this.posts[postIndex].comments[commentIndex].commentReplies.splice(replyIndex, 1, data)
    },
    // 刪除回覆留言
    async deleteReplyData (reply_id, comment_id, post_id) {
      const postIndex = this.posts.findIndex((post) => post._id === post_id)
      const commentIndex = this.posts[postIndex].comments.findIndex((comment) => comment._id === comment_id)
      const replyIndex = this.posts[postIndex].comments[commentIndex].commentReplies.findIndex(
        (reply) => reply._id === reply_id
      )
      this.posts[postIndex].comments[commentIndex].commentReplies.splice(replyIndex, 1)
    },
    // 新增／移除 收藏
    async patchPostLikesData (post_id, data) {
      const postIndex = this.posts.findIndex((post) => post._id === post_id)
      this.posts[postIndex].likes = data.likes
    }
  }
})
