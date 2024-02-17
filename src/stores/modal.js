import { defineStore } from 'pinia'

export const useModalStore = defineStore('modalStore', {
  // data
  state: () => ({
    showLoading: false,
    showLoadingText: '載入中',
    showAlert: false,
    showAlertText: [],
    showAlertCls: '',
    showImagesBox: false,
    showImagesTemp: null,
    showPostUploadBox: false,
    showPostUploadTemp: null,
    showPostLikesBox: false,
    showPostLikesTemp: null,
    showCommentEditorBox: false,
    showCommentEditorType: '',
    showCommentEditorTemp: {}
  }),
  // methods
  actions: {
    lockScroll () {
      const body = document.querySelector('body')
      body.style.overflow = 'hidden'
    },
    unLockScroll () {
      const body = document.querySelector('body')
      body.style.removeProperty('overflow')
    },
    openLoading (text) {
      if (text) this.showLoadingText = text
      this.showLoading = true
    },
    closeLoading () {
      this.showLoadingText = '載入中'
      this.showLoading = false
    },
    openAlert (cls, ...info) {
      if (this.showAlert) return
      this.showAlert = true
      this.showAlertCls = cls
      info.forEach((t) => {
        this.showAlertText.push(t)
      })
      setTimeout(() => {
        this.showAlert = false
        this.showAlertCls = ''
        this.showAlertText = []
      }, 2000)
    },
    openImagesBox (control, data) {
      if (control) {
        this.lockScroll()
        this.showImagesBox = true
        this.showImagesTemp = data
      } else {
        this.unLockScroll()
        this.showImagesBox = false
        this.showImagesTemp = null
      }
    },
    openPostUploadBox (control, data) {
      if (control) {
        this.lockScroll()
        this.showPostUploadBox = true
        this.showPostUploadTemp = data
      } else {
        this.unLockScroll()
        this.showPostUploadBox = false
        this.showPostUploadTemp = null
      }
    },
    openPostLikesBox (control, data) {
      if (control) {
        this.lockScroll()
        this.showPostLikesBox = true
        this.showPostLikesTemp = data
      } else {
        this.unLockScroll()
        this.showPostLikesBox = false
        this.showPostLikesTemp = null
      }
    },
    openCommentEditorBox (control, type, data) {
      // type: patchComment, postReply, patchReply
      if (control) {
        this.lockScroll()
        this.showCommentEditorType = type
        this.showCommentEditorBox = true
        if (data) this.showCommentEditorTemp = data
      } else {
        this.unLockScroll()
        this.showCommentEditorBox = false
        this.showCommentEditorType = ''
        this.showCommentEditorTemp = {}
      }
    }
  }
})
