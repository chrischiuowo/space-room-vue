<template>
  <Transition name="fade">
    <img v-if="/\.(png|jpg|jpe?g)$/i.test(photo?.link)" v-lazy="photo?.link" />
    <div v-else>
      <i class="fa-solid fa-face-smile" />
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  photo: Object
})
</script>
