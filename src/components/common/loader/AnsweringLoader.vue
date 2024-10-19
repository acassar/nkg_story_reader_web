<script setup lang="ts"></script>

<template>
  <div class="is-typing">
    <div class="dot1"></div>
    <div class="dot2"></div>
    <div class="dot3"></div>
  </div>
</template>

<style scoped>
.is-typing {
  margin-top: 20px;
  width: 50px;
  justify-content: space-around;
  display: flex;
}

.dot1,
.dot2,
.dot3 {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: gray;
}

.dot1 {
  animation: typing 1.2s linear infinite;
  animation-delay: 01.1s;
}

.dot2 {
  animation: typing 1.2s linear infinite;
  animation-delay: 01.2s;
}

.dot3 {
  animation: typing 1.2s linear infinite;
  animation-delay: 01.3s;
}

@keyframes typing {
  0% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(5px);
  }
  35% {
    transform: translateY(15px);
  }
  45% {
    transform: translateY(0px);
  }
  60% {
    transform: translateY(-15px);
  }
  75% {
    background-color: white;
    transform: translateY(0px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
