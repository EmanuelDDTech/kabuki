<template>
  <div class="h-screen w-screen flex justify-center items-center bg-white">
    <div class="deck">
      <div class="card card1"></div>
      <div class="card card2"></div>
      <div class="card card3"></div>
    </div>
  </div>
</template>

<style scoped>
.deck {
  position: relative;
  width: 120px;
  height: 160px;
}

.card {
  position: absolute;
  width: 80px;
  height: 112px;
  border-radius: 10px;
  /* background: radial-gradient(circle at center, #ffffff, #2a75bb); */
  background: radial-gradient(circle at center, #ffffff, #16a34a);
  border: 2px solid #2a75bb;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  animation: shuffle 3s infinite ease-in-out;
  transform-origin: center center;
  backface-visibility: hidden;
}

.card1 {
  animation-delay: 0s;
  z-index: 5;
}
.card2 {
  animation-delay: 1s;
  z-index: 3;
}
.card3 {
  animation-delay: 2s;
  z-index: 1;
}

@keyframes shuffle {
  0% {
    transform: translateX(0px);
    z-index: 5;
  }
  16% {
    transform: rotate(5deg) translateX(120%);
  }
  33% {
    transform: translateX(-30%);
    z-index: 1;
  }
  49% {
    transform: translateX(-30%);
  }
  66% {
    transform: translateX(-15%);
    z-index: 2;
  }
  67% {
    z-index: 3;
  }
  82% {
    transform: translateX(-15%);
  }
  100% {
    transform: translateX(0px);
    z-index: 4;
  }
}
</style>
