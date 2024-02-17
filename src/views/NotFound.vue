<template>
  <section class="not-found">
    <div class="container-box">
      <div class="t">
        <h2>404</h2>
        <h3>PAGE NOT FOUND</h3>
      </div>
      <div class="g">
        <div class="ghost-copy">
          <div class="one" />
          <div class="two" />
          <div class="three" />
          <div class="four" />
        </div>
        <div class="ghost">
          <div class="face">
            <div class="eye" />
            <div class="eye-right" />
            <div class="mouth" />
          </div>
        </div>
        <div class="shadow" />
      </div>
      <div class="go-back">
        <router-link
          to="/"
          class="base-button"
        >
          返回首頁
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped lang="scss">
@import '../assets/scss/base/variables';
@import '../assets/scss/base/mixins';

.container-box {
  background: $c-gray-4;
  flex-direction: column;
}

.t {
  margin-bottom: 20px;
}

h2 {
  font-size: px(100);
  text-align: center;
  text-shadow: -1px 0 $c-gray-2, 0 1px $c-gray-2, 1px 0 $c-gray-2, 0 -1px $c-gray-2;
  letter-spacing: 1.2px;
  color: $c-white;
}

h3 {
  font-size: px(30);
  font-weight: $bold;
  text-align: center;
  color: $c-gray-2;
  margin-top: 20px;
}

.g {
  position: relative;
  width: 250px;
  height: 250px;
}

.ghost {
  width: 50%;
  height: 53%;
  left: 25%;
  top: 10%;
  position: absolute;
  border-radius: 50% 50% 0 0;
  background: $c-white;
  border: 1px solid $c-gray-2;
  border-bottom: none;
  animation: float 2s ease-out infinite;
}

.ghost-copy {
  width: 50%;
  height: 53%;
  left: 25%;
  top: 10%;
  position: absolute;
  border-radius: 50% 50% 0 0;
  background: $c-white;
  border: 1px solid $c-gray-2;
  border-bottom: none;
  animation: float 2s ease-out infinite;
  z-index: 0;
}

.face {
  position: absolute;
  width: 100%;
  height: 60%;
  top: 20%;
}

.eye,
.eye-right {
  position: absolute;
  background: $c-gray-4;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  top: 40%;
}

.eye {
  left: 25%;
}

.eye-right {
  right: 25%;
}

.mouth {
  position: absolute;
  top: 50%;
  left: 45%;
  width: 10px;
  height: 10px;
  border: 3px solid;
  border-radius: 50%;
  border-color: transparent $c-gray-4 $c-gray-4 transparent;
  transform: rotate(45deg);
}

.one,
.two,
.three,
.four {
  position: absolute;
  background: $c-white;
  top: 85%;
  width: 25%;
  height: 23%;
  border: 1px solid $c-gray-2;
  z-index: 0;
}

.one {
  border-radius: 0 0 100% 30%;
  left: -1px;
}

.two {
  left: 23%;
  border-radius: 0 0 50% 50%;
}

.three {
  left: 50%;
  border-radius: 0 0 50% 50%;
}

.four {
  left: 76.5%;
  border-radius: 0 0 30% 100%;
}

.shadow {
  position: absolute;
  width: 30%;
  height: 7%;
  background: $c-gray-2;
  left: 35%;
  top: 80%;
  border-radius: 50%;
  animation: scale 2s infinite;
}

@keyframes scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  50% {
    transform: translateY(15px);
  }
}
</style>
