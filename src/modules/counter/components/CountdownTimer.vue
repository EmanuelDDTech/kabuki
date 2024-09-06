<template>
  <div class="circle-container">
    <div class="circle text-xl flex items-center gap-2">
      <p
        :class="{ 'clock-stopped': !isStarted }"
        class="text-white bg-red-500 p-1 rounded-full w-9 text-center aspect-square"
      >
        {{ hourString }}
      </p>
      <span>:</span>
      <p
        :class="{ 'clock-stopped': !isStarted }"
        class="text-white bg-red-500 p-1 rounded-full w-9 text-center aspect-square"
      >
        {{ minuteString }}
      </p>
      <span>:</span>
      <p
        :class="{ 'clock-stopped': !isStarted }"
        class="text-white bg-red-500 p-1 rounded-full w-9 text-center aspect-square"
      >
        {{ secondString }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const emit = defineEmits(['timeDecrease']);
const clock = ref('00:00:00');
const hourString = ref<string | number>('');
const minuteString = ref<string | number>('');
const secondString = ref<string | number>('');
const props = defineProps<{
  duration: number;
  isStarted: boolean;
}>();
let intervalId: number;
// let soundOn = ref(true);

const isStarted = computed(() => {
  return props.isStarted;
});

const duration = computed(() => {
  return props.duration;
});

let storedDuration = props.duration;

onMounted(() => {
  if (isStarted.value) {
    startTimer();
  } else {
    stopTimer();
  }
});

const startTimer = function () {
  intervalId = setInterval(() => {
    if (storedDuration <= 0) {
      clearInterval(intervalId);
    } else {
      updateDisplay(storedDuration - 1);
      storedDuration--;
      emit('timeDecrease');
    }
  }, 1000);
};

const stopTimer = function () {
  clearInterval(intervalId);
};

function updateDisplay(time: number) {
  let hours, minutes, seconds: number;

  hours = Math.floor(time / 60 / 60);
  minutes = Math.floor(time / 60 - hours * 60);
  seconds = Math.floor(time % 60);

  hourString.value = hours < 10 ? '0' + hours : hours;
  minuteString.value = minutes < 10 ? '0' + minutes : minutes;
  secondString.value = seconds < 10 ? '0' + seconds : seconds;

  clock.value = `${hourString.value}:${minuteString.value}:${secondString.value}`;
}

watch(duration, () => {
  storedDuration = duration.value;
  updateDisplay(storedDuration);
});
</script>
