<template>
  <div class="more-user">
    <div class="common-title" data-aos="fade" data-aos-delay="800">
      <p>找朋友</p>
    </div>
    <div class="users">
      <template v-if="users.length">
        <UserItem v-for="user in users" :key="user._id" :user="user" />
      </template>
      <template v-else>
        <UserItem :user="{}" />
      </template>
    </div>
    <div class="button-wrap">
      <button class="base-button blue" type="button" @click.stop="getData()">重新尋找</button>
    </div>
  </div>
</template>

<script setup>
import UserItem from '@/components/UserItem.vue'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getRandomUsers } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'

const modalStore = useModalStore()
const userStore = useUserStore()
const { user_id } = storeToRefs(userStore)
const { openLoading, closeLoading } = modalStore

const users = ref([])
const getData = async () => {
  openLoading('尋找中')
  users.value.length = 0
  const { data: usersData } = await getRandomUsers()
  const checkSelf = usersData.data.findIndex((user) => user._id === user_id.value)
  if (checkSelf > -1) usersData.data.splice(checkSelf, 1)
  users.value = usersData.data
  closeLoading()
}
if (user_id.value) getData()
watch(
  () => user_id.value,
  () => {
    if (users.value?.length) return
    getData()
  }
)
</script>

<style scoped lang="scss">
@import '../assets/scss/base/variables';
@import '../assets/scss/base/mixins';

.users {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 25px;
}

.button-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
}

.base-button {
  margin-top: 40px;
  max-width: 250px;
}
</style>
