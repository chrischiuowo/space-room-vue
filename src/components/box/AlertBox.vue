<template>
  <div
    v-if="showAlertText?.length"
    class="alert-box"
    :class="showAlertCls"
  >
    <div class="alert-container">
      <div class="alert-inner">
        <p
          v-for="t in showAlertText"
          :key="t"
        >
          {{ t }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { showAlertText, showAlertCls } = modalStore
</script>

<style scoped lang="scss">
@import '../../assets/scss/base/variables';
@import '../../assets/scss/base/mixins';

.alert-box {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  &.success {
    .alert-inner {
      color: $c-white;
      background-color: $c-green;
    }
  }

  &.error {
    .alert-inner {
      color: $c-white;
      background-color: $c-red;
    }
  }
}

.alert-container {
  width: auto;
  height: auto;

  .alert-inner {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    width: auto;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba($c-black, 0.5);
    align-content: center;
  }

  p {
    margin: 3px;
    font-size: px(18);
    font-weight: $medium;
    letter-spacing: 1.2px;
    line-height: 1.4;

    &:not(:first-child)::before {
      content: ', ';
    }
  }

  @include mobile {
    p {
      font-size: px(12);
    }
  }
}
</style>
