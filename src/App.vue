<template>
  <router-view />
  <Transition name="fade">
    <LoadingBox v-if="showLoading" />
  </Transition>
  <Transition name="fade-alert">
    <AlertBox v-if="showAlert" />
  </Transition>
</template>

<script setup>
import LoadingBox from '@/components/box/LoadingBox.vue'
import AlertBox from '@/components/box/AlertBox.vue'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { showLoading, showAlert } = storeToRefs(modalStore)
</script>
