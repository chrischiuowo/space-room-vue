<template>
  <div class="full-box">
    <div class="full-container">
      <div class="full-inner">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
        <p v-if="showLoadingText">
          {{ showLoadingText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
const modalStore = useModalStore()
const { showLoadingText } = storeToRefs(modalStore)
</script>

<style scoped lang="scss">
@import '../../assets/scss/base/variables';

.lds-ellipsis {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
}

.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  background: #fff;
  border-radius: 50%;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}

p {
  width: 100%;
  font-size: px(15);
  font-weight: $medium;
  text-align: center;
  color: $c-white;
  animation: text 0.7s infinite;
}

@keyframes text {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(24px, 0);
  }
}
</style>
