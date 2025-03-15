<template>
  <div class="circle-container">
    <div class="circle text-xl flex items-center gap-2">
      <p
        :class="{ 'clock-stopped': stopTimer }"
        class="text-white bg-red-500 p-1 rounded-full w-9 text-center aspect-square"
      >
        {{ dayString > 0 ? dayString : '00' }}
      </p>
      <span>:</span>
      <p
        :class="{ 'clock-stopped': stopTimer }"
        class="text-white bg-red-500 p-1 rounded-full w-9 text-center aspect-square"
      >
        {{ hourString > 0 ? hourString : '00' }}
      </p>
      <span>:</span>
      <p
        :class="{ 'clock-stopped': stopTimer }"
        class="text-white bg-red-500 p-1 rounded-full w-9 text-center aspect-square"
      >
        {{ minuteString > 0 ? minuteString : '00' }}
      </p>
      <span>:</span>
      <p
        :class="{ 'clock-stopped': stopTimer }"
        class="text-white bg-red-500 p-1 rounded-full w-9 text-center aspect-square"
      >
        {{ secondString > 0 ? secondString : '00' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const emit = defineEmits(['timeDecrease']);
const clock = ref('00:00:00');
const dayString = ref<string | number>('');
const hourString = ref<string | number>('');
const minuteString = ref<string | number>('');
const secondString = ref<string | number>('');
const stopTimer = ref<boolean>(false);

const props = defineProps<{
  duration: number;
  finishDate?: String;
}>();

let intervalId: number;

let storedDuration = new Date(props.finishDate) - new Date();

onMounted(() => {
  startTimer();
});

const startTimer = function () {
  intervalId = setInterval(() => {
    if (storedDuration <= 0) {
      stopTimer.value = true;
      clearInterval(intervalId);
    } else {
      updateDisplay(storedDuration - 1000);
      storedDuration = storedDuration - 1000;
      emit('timeDecrease');
    }
  }, 1000);
};

function updateDisplay(time: number) {
  let days, hours, minutes, seconds: number;

  days = Math.floor(time / 86400000);
  hours = Math.floor((time / 3600000) % 24);
  minutes = Math.floor((time / 60000) % 60);
  seconds = Math.floor((time / 1000) % 60);

  dayString.value = days < 10 ? '0' + days : days;
  hourString.value = hours < 10 ? '0' + hours : hours;
  minuteString.value = minutes < 10 ? '0' + minutes : minutes;
  secondString.value = seconds < 10 ? '0' + seconds : seconds;

  clock.value = `${dayString.value}:${hourString.value}:${minuteString.value}:${secondString.value}`;
}
</script>
