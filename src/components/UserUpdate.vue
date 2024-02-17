<template>
  <div class="user-update">
    <div class="common-title" data-aos="fade" data-aos-delay="800">
      <p>修改個人資料</p>
    </div>
    <div class="update-inner" data-aos="fade">
      <div class="tabs">
        <div class="tab" :class="{ active: tabSwitch === 1 }" @click="switchPage(1)">資料修改</div>
        <div class="tab" :class="{ active: tabSwitch === 2 }" @click="switchPage(2)">重設密碼</div>
      </div>
      <div class="contents">
        <div v-show="tabSwitch === 1" class="content">
          <div class="user-iamge">
            <div class="user-photo-outer">
              <UserPhoto v-if="!tempFile" :photo="tempUser.avatar" />
              <img v-else :src="tempUser.avatar?.link" alt="" />
            </div>
            <button class="image-add" type="button">
              <label for="upload">
                上傳大頭貼
                <input id="upload" name="image" type="file" accept="image/*" @change="preloadImageHandler" />
              </label>
            </button>
          </div>
          <div class="inp name">
            <p>名稱</p>
            <input v-model="tempUser.name" type="text" placeholder="Name" />
          </div>
          <button class="base-button blue" type="button" @click="patchUserInfoHandler">更新個人資料</button>
          <button class="base-button red delete" type="button" @click="deleteUserInfoHandler">刪除帳號</button>
        </div>
        <div v-show="tabSwitch === 2" class="content">
          <div class="inp password">
            <p>輸入密碼</p>
            <input v-model="updateValue.password" type="password" placeholder="Password" />
          </div>
          <div class="inp confirmPassword">
            <p>再次輸入密碼</p>
            <input v-model="updateValue.confirmPassword" type="password" placeholder="ConfirmPassword" />
          </div>
          <template v-if="errorMessage.all.length">
            <div class="err-t">
              <p v-for="item in errorMessage.all" :key="item">
                {{ item }}
              </p>
            </div>
          </template>
          <button class="base-button blue" type="button" @click="updatePassword">重設密碼</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserPhoto from '@/components/UserPhoto.vue'
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted } from 'vue'
import router from '@/router'
import {
  checkToken,
  patchPassword,
  postUploadImage,
  deleteUploadImage,
  getUserInfo,
  patchUserInfo,
  deleteUserInfo
} from '@/fetch/fetch'
import { isNotEmpty, isValidPassword, isSamePassword } from '@/services/validate'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'

// store 資料
const modalStore = useModalStore()
const userStore = useUserStore()
const { user_id, name, avatar } = storeToRefs(userStore)
const { openAlert, openLoading, closeLoading } = modalStore
const { patchUser, logoutAuth } = userStore

const tabSwitch = ref(1)
const tempUser = reactive({
  user_id: null,
  name: null,
  avatar: null
})
const tempFile = ref(null)
const errorMessage = reactive({ all: [] })
const updateValue = reactive({
  password: '',
  confirmPassword: ''
})

Object.assign(tempUser, {
  user_id: user_id.value,
  name: name.value,
  avatar: avatar.value
})

const preloadImageHandler = (e) => {
  if (!e.target.files.length) return
  const file = e.target.files[0]
  const fileSize = Math.ceil(file.size / 1024)
  if (fileSize > 200) {
    openAlert('error', '圖片檔案過大，僅限 2mb 以下檔案')
  } else {
    tempUser.avatar.link = URL.createObjectURL(file)
    tempFile.value = file
  }
}

const patchUserInfoHandler = async () => {
  if (tempUser.avatar.link === '' || tempUser.name === '') {
    openAlert('error', '填入資料不得為空！')
    return false
  }
  openLoading('更新個人資料中！')

  // 上傳圖片
  if (tempFile.value) {
    console.log('upload')
    const form = new FormData()
    form.append('files-upload', tempFile.value)
    const { data: imageData } = await postUploadImage(form)
    tempUser.avatar = imageData.data.images[0]
  }

  // 刪除圖片
  if (tempUser.avatar.hash && tempFile.value && avatar.value.hash !== null) {
    console.log('delete', avatar.value)
    await deleteUploadImage(avatar.value.hash)
  }

  // 更新
  const { data } = await patchUserInfo(tempUser.user_id, tempUser)
  await patchUser({
    user_id: data.data._id,
    name: data.data.name,
    avatar: data.data.avatar
  })
  closeLoading()
  openAlert('success', '更新成功！')
  tempFile.value = null
}

const deleteUserInfoHandler = async () => {
  openLoading('刪除個人資料中！')
  // 刪除圖片
  if (avatar.value.hash) {
    await deleteUploadImage(tempUser.avatar.hash)
  }
  await deleteUserInfo(user_id.value)
  closeLoading()
  openAlert('success', '刪除成功！')
  logoutAuth()
  router.push('/auth')
}

const updatePassword = async () => {
  // 清空錯誤
  errorMessage.all.length = 0
  if (isNotEmpty(updateValue.password)) {
    errorMessage.all.push(`密碼 ${isNotEmpty(updateValue.password)}`)
  }
  if (isValidPassword(updateValue.password)) {
    errorMessage.all.push(isValidPassword(updateValue.password))
  }
  if (isSamePassword(updateValue.password, updateValue.confirmPassword)) {
    errorMessage.all.push(isSamePassword(updateValue.password, updateValue.confirmPassword))
  }
  if (errorMessage.all.length) {
    openAlert('error', ...errorMessage.all)
    return
  }
  openLoading('更新中')
  await patchPassword({
    password: updateValue.password,
    confirm_password: updateValue.confirmPassword
  })
  Object.assign(updateValue, {
    password: '',
    confirmPassword: ''
  })
  closeLoading()
  openAlert('success', '更新成功')
}

const switchPage = (n) => {
  tabSwitch.value = n
  // 1
  Object.assign(tempUser, {
    user_id: user_id.value,
    name: name.value,
    avatar: avatar.value
  })
  tempFile.value = null
  // 2
  errorMessage.all.length = 0
  Object.assign(updateValue, {
    password: '',
    confirmPassword: ''
  })
}

onMounted(async () => {
  if (!user_id.value) {
    openLoading('取得個人資料中！')
    const { data: now_user } = await checkToken()
    const { data } = await getUserInfo(now_user.data._id)
    if (data.status) {
      patchUser({
        user_id: data.data._id,
        name: data.data.name,
        avatar: data.data.avatar
      })
      Object.assign(tempUser, {
        user_id: data.data._id,
        name: data.data.name,
        avatar: data.data.avatar
      })
    }
    closeLoading()
    openAlert('success', '取得成功！')
  }
})
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.update-inner {
  width: 100%;
}

.tabs {
  display: flex;
  align-items: stretch;
  margin: 0 auto;
  width: 95%;

  .tab {
    margin-right: 10px;
    padding: 10px 15px;
    color: var(--dark);
    background-color: var(--light);
    border: 2px solid var(--dark);
    border-radius: 8px 8px 0 0;
    user-select: none;
    cursor: pointer;
    transition: 0.5s;
    border-bottom: unset;

    &.active {
      color: var(--light);
      background-color: var(--dark);
    }
  }
}

.contents {
  position: relative;
  padding: 50px 25px 60px;
  width: 100%;
  color: var(--dark);
  background-color: var(--light);
  border: 2px solid var(--dark);
  border-radius: 8px 8px 15px 15px;
  z-index: 1;

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-direction: column;
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
  border: 2px solid var(--dark);
  border-radius: 4px;
  letter-spacing: 1.5px;
  line-height: 1.4;

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

.user-photo-outer {
  margin: 0;
  margin-bottom: 20px;
  width: 120px;
  height: 120px;
}

.inp {
  margin-top: 30px;
  width: 100%;
  max-width: 400px;

  &:first-child {
    margin-top: 0;
  }

  > p {
    margin-bottom: 12px;
    font-weight: $medium;
  }
}

.err-t {
  margin-top: 15px;
}

.base-button {
  margin-top: 40px;
  width: 100%;
  max-width: 300px;

  &.delete {
    margin-top: 20px;
  }
}
</style>
