import { computed, ref } from 'vue';

// const counter = ref(10);

export const useCounter = (initialValue: number = 5) => {
  const counter = ref(initialValue);

  const res = () => {
    if (counter.value <= 0) return;
    counter.value--;
  };
  const sum = () => {
    if (counter.value >= 10) return;
    counter.value++;
  };

  return {
    counter,

    // Methods
    res,
    sum,
  };
};
