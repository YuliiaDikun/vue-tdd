<template>
  <div data-test="activation">
    <h1
      v-if="isSuccess"
      class="p-5 rounded bg-green-100 text-center text-slate-800 mt-3 font-medium"
      data-test="success-activation"
    >
      Account is activated!
    </h1>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

import { activate } from "../api/apiCalls";

const isSuccess = ref(false);


onMounted(async () => {
  try {    
    const token = useRoute().params.token;
    await activate(token);
    isSuccess.value = true;
  } catch (error) {}
});
</script>
