<template>
  <div class="full-box">
    <div
      class="full-bg"
      @click="openImagesBox(false)"
    />
    <div class="full-container">
      <div class="full-inner">
        <div
          class="close-button"
          @click="openImagesBox(false)"
        >
          <i class="fa-solid fa-xmark" />
        </div>
        <div class="images-inner">
          <swiper
            :modules="[Lazy, Navigation, Pagination, EffectFade]"
            :speed="1000"
            :space-between="20"
            :pagination="{ clickable: true }"
            :navigation="true"
            :effect="'fade'"
            :fade-effect="{ crossFade: true }"
            :lazy="{ loadPrevNext: true }"
          >
            <swiper-slide
              v-for="(image, index) in showImagesTemp"
              :key="'image' + index"
            >
              <img
                class="swiper-lazy"
                :data-src="image.link"
                alt=""
              >
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { Lazy, Navigation, Pagination, EffectFade } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useModalStore } from '@/stores/modal'
import { onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { showImagesTemp } = storeToRefs(modalStore)
const { openImagesBox } = modalStore

onMounted(() => {
  const element = document.querySelector('.images-inner')
  element.addEventListener('click', function (e) {
    e.stopPropagation()
  })
})

onBeforeUnmount(() => {
  const element = document.querySelector('.swiper-pagination')
  element.style.display = 'none'
})
</script>

<style scoped lang="scss">
@import '../../assets/scss/base/variables';

.swiper-slide {
  padding: 35px;
}

.close-button {
  position: relative;
  margin-bottom: 5px;
  color: $c-white;
  z-index: 2;
}

.images-inner {
  width: 100%;
  max-width: 800px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    box-shadow: 0 3px 15px rgba($c-black, 0.5);
  }
}
</style>
