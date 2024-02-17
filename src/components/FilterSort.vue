<template>
  <div class="filter-select" :class="{ active: selecting }">
    <div class="drop-top" @click="selecting = !selecting">
      <div class="now-value">
        {{ selectValue === 'hot' ? '最熱門貼文' : selectValue === 'old' ? '最舊貼文' : '最新貼文' }}
      </div>
      <div class="arrow">
        <i class="fa-solid fa-caret-down" />
      </div>
    </div>
    <div class="drop-bottom">
      <ul>
        <li :class="{ selected: selectValue === null }" @click.stop="selected(null)">最新貼文</li>
        <li :class="{ selected: selectValue === 'hot' }" @click.stop="selected('hot')">最熱門貼文</li>
        <li :class="{ selected: selectValue === 'old' }" @click.stop="selected('old')">最舊貼文</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()

const selecting = ref(false)
const selectValue = ref(null)
if (route.query.s) selectValue.value = route.query.s
const selected = async (sort) => {
  if (selectValue.value === sort) return
  selectValue.value = sort
  selecting.value = false
  await router.push({
    query: Object.assign({}, route.query, {
      s: selectValue.value
    })
  })
  window.location.reload()
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';

.filter-select {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  color: var(--dark);
  user-select: none;
  cursor: pointer;
  z-index: 5;
}

.drop-top {
  position: relative;
  display: flex;
  padding: 10px 15px 8px;
  width: 100%;
  min-height: 40px;
  background-color: var(--light);
  border: 2px solid var(--dark);
  border-radius: 8px 8px 15px 15px;
  transition: 0.2s;
  z-index: 1;

  .now-value {
    font-weight: $medium;
  }

  .arrow {
    margin-left: auto;
    font-size: px(20);
  }
}

.drop-bottom {
  position: absolute;
  top: calc(100% - 10px);
  left: 50%;
  width: 100%;
  border: 2px solid var(--dark);
  border-radius: 0 0 15px 15px;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transition: 0.2s;
  z-index: 0;
  transform: translate(-50%, 10px);

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--light2);
    opacity: 0.8;
    pointer-events: none;
    z-index: -1;
    backdrop-filter: blur(3px);
    content: '';
  }

  ul {
    display: flex;
    flex-direction: column;
    padding-top: 8px;
  }

  li {
    padding: 12px;
    width: 100%;
    user-select: none;
    cursor: pointer;
    border-bottom: 1px solid $c-black;

    &.selected {
      color: $c-white;
      background-color: $c-first;
    }
  }
}

.filter-select.active {
  .drop-top {
    border-radius: 8px 8px 0 0;
    transition: 0.4s;
  }

  .drop-bottom {
    opacity: 1;
    pointer-events: all;
    transform: translate(-50%, 0);
    transition: 0.4s;
  }
}
</style>
