<template>
  <div class="full-box">
    <div class="full-container">
      <div class="full-inner">
        <div class="main-inner animate-inner">
          <div class="top-control">
            <div
              class="close-button"
              @click="openPostUploadBox(false)"
            >
              <i class="fa-solid fa-xmark" />
            </div>
          </div>
          <div class="full-title">
            <p v-if="isPatchMode">
              編輯動態中
            </p>
            <p v-else>
              新增動態吧
            </p>
          </div>
          <div class="inner-content">
            <div class="wrap editor-section">
              <p v-if="isPatchMode">
                編輯貼文內容
              </p>
              <p v-else>
                輸入貼文內容
              </p>
              <div class="editor-outer">
                <ul
                  v-if="editor"
                  class="editor-tool"
                >
                  <li
                    :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                  >
                    <i class="fa-solid fa-heading" />
                  </li>
                  <li
                    :class="{ 'is-active': editor.isActive('paragraph') }"
                    @click="editor.chain().focus().setParagraph().run()"
                  >
                    <i class="fa-solid fa-p" />
                  </li>
                  <li
                    :class="{ 'is-active': editor.isActive('bold') }"
                    @click="editor.chain().focus().toggleBold().run()"
                  >
                    <i class="fa-solid fa-bold" />
                  </li>
                  <li
                    :class="{ 'is-active': editor.isActive('italic') }"
                    @click="editor.chain().focus().toggleItalic().run()"
                  >
                    <i class="fa-solid fa-italic" />
                  </li>
                  <li
                    :class="{ 'is-active': editor.isActive('strike') }"
                    @click="editor.chain().focus().toggleStrike().run()"
                  >
                    <i class="fa-solid fa-strikethrough" />
                  </li>
                  <li
                    :class="{ 'is-active': editor.isActive('highlight') }"
                    @click="editor.chain().focus().toggleHighlight().run()"
                  >
                    <i class="fa-solid fa-highlighter" />
                  </li>
                </ul>
                <editor-content :editor="editor" />
              </div>
            </div>
            <div
              v-if="sendData.images?.length"
              class="wrap patch-images-section"
            >
              <p>目前上傳的圖片</p>
              <div class="images">
                <img
                  v-for="(image, index) in sendData.images"
                  :key="'image' + index"
                  :src="image.link"
                  alt=""
                >
              </div>
            </div>
            <div class="wrap image-section">
              <p>上傳貼文圖片</p>
              <div class="buttons">
                <button
                  class="image-add"
                  type="button"
                >
                  <label for="upload">
                    上傳圖片
                    <input
                      id="upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      multiple="multiple"
                      @change="preloadImageHandler"
                    >
                  </label>
                </button>
                <button
                  class="image-clear"
                  type="button"
                  @click="clearImageHandler"
                >
                  清除圖片
                </button>
              </div>
              <div
                v-if="imagesPrePath?.length"
                class="images"
              >
                <img
                  v-for="(path, index) in imagesPrePath"
                  :key="'image' + index"
                  :src="path"
                  alt=""
                >
              </div>
            </div>
            <div class="wrap control-section">
              <button
                v-if="isPatchMode"
                class="base-button blue"
                type="button"
                @click="patchSubmit"
              >
                編輯完成
              </button>
              <button
                v-else
                class="base-button blue"
                type="button"
                @click="postSubmit"
              >
                確認送出
              </button>
              <button
                v-if="isPatchMode"
                class="base-button red"
                type="button"
                @click="openPostUploadBox(false)"
              >
                取消編輯
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { postUploadImage, deleteUploadImage, postOnePost, patchOnePost } from '@/fetch/fetch'
import router from '@/router/index'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'

const sendData = ref({
  // 先宣告做判斷
  content: '',
  images: []
})
// store 資料
const modalStore = useModalStore()
const postStore = usePostStore()
const { showPostUploadTemp } = storeToRefs(modalStore)
const { openLoading, closeLoading, openAlert, openPostUploadBox } = modalStore
const { patchPost } = postStore

// 編輯模式處理
const isPatchMode = !!showPostUploadTemp.value?._id
if (isPatchMode) {
  Object.assign(sendData.value, showPostUploadTemp.value)
}

// 編輯器處理
const editor = useEditor({
  content: sendData.value.content,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '輸入貼文內容 ...'
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Highlight
  ],
  onUpdate: ({ editor }) => {
    sendData.value.content = editor.getHTML()
  }
})

// 圖片處理
const imagesPrePath = ref([])
const imagesFile = ref([])
// 預覽圖檔
const preloadImageHandler = (e) => {
  if (!e.target.files.length) return
  Array.prototype.forEach.call(e.target.files, function (file) {
    const fileSize = Math.ceil(file.size / 1024)
    if (fileSize > 200) {
      openAlert('error', '圖片檔案過大，僅限 2mb 以下檔案')
    } else {
      imagesPrePath.value.push(URL.createObjectURL(file))
      imagesFile.value.push(file)
    }
  })
}
// 清除圖片
const needDeleteImages = ref([])
const clearImageHandler = () => {
  imagesPrePath.value = []
  imagesFile.value = []
  if (sendData.value.images) {
    needDeleteImages.value = sendData.value.images
    sendData.value.images = []
  }
}

// 確認送出
const postSubmit = async () => {
  if (sendData.value.content === '<p></p>' || sendData.value.content === '' || sendData.value.content === '<h2></h2>') {
    openAlert('error', '填寫內容不得為空白！')
    return false
  }
  openLoading('上傳貼文中')
  if (imagesFile.value?.length) {
    const form = new FormData()
    imagesFile.value.forEach((file) => {
      form.append('files-upload', file)
    })
    const { data: imageData } = await postUploadImage(form)
    sendData.value.images.push(...imageData.data.images)
  }
  // console.log('上傳的資料：', sendData.value)
  await postOnePost(sendData.value)
  openPostUploadBox(false)
  closeLoading()
  openAlert('success', '上傳成功！')
  if (router.currentRoute.value.path === '/') {
    window.location.reload()
  } else {
    router.push('/')
  }
}

// 編輯完成
const patchSubmit = async () => {
  if (sendData.value.content === '<p></p>' || sendData.value.content === '' || sendData.value.content === '<h2></h2>') {
    openAlert('error', '填寫內容不得為空白！')
    return false
  }
  openLoading('更新貼文中')
  // 請求刪除需要移除的圖片
  if (needDeleteImages.value?.length) {
    for await (const image of needDeleteImages.value) {
      await deleteUploadImage(image.hash)
    }
  }
  if (imagesFile.value?.length) {
    const form = new FormData()
    imagesFile.value.forEach((file) => {
      form.append('files-upload', file)
    })
    const { data: imageData } = await postUploadImage(form)
    sendData.value.images.push(...imageData.data.images)
  }
  // console.log('編輯的資料：', sendData.value)
  await patchOnePost(sendData.value)
  await patchPost(sendData.value)
  openPostUploadBox(false)
  closeLoading()
  openAlert('success', '編輯成功！')
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/base/mixins';
@import '../../assets/scss/base/variables';

.main-inner {
  width: 100%;
  max-width: 1200px;
}

.full-title {
  margin: 0 auto 25px;
}

.inner-content {
  margin: 0 auto;
  padding: 30px 25px;
  width: 100%;
  background-color: var(--light);
  border: 2px solid var(--dark);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(var(--dark) 0.25);
  border-bottom: 6px solid var(--dark);

  @include mobile {
    padding: 30px 15px;
  }
}

.wrap {
  margin-bottom: 40px;

  &:last-child {
    margin: 0;
    padding-top: 30px;
    padding-bottom: 15px;
  }

  p {
    margin-bottom: 20px;
    font-size: px(18);
    font-weight: $medium;
    color: var(--dark);
  }

  @include mobile {
    p {
      font-size: px(16);
    }
  }
}

.image-section {
  .buttons {
    display: flex;
    width: 100%;
    align-content: center;
  }
}

.control-section {
  > * {
    &:not(:first-child) {
      margin-top: 15px;
    }
  }

  a {
    display: block;
  }
}

.images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;

  img {
    margin: 5px;
    width: 150px;
    height: auto;
  }

  @include mobile-s {
    img {
      width: 100px;
    }
  }
}

.image-add {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 40px;
  color: var(--light);
  background-color: var(--dark);
  border-radius: 4px;
  line-height: 1.4;
  letter-spacing: 1.5px;

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    user-select: none;
    cursor: pointer;
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
    user-select: none;
  }
}

.image-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  width: 120px;
  height: 40px;
  color: $c-white;
  background-color: $c-red;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  line-height: 1.4;
  letter-spacing: 1.5px;
}
</style>
