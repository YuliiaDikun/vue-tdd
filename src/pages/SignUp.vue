<template>
  <div class="max-w-7lx mx-auto px-5 pt-10 text-white">
    <form
      class="border border-gray-300 rounded-lg p-5 mx-auto flex flex-col items-center max-w-[500px] gap-5 justify-center"
    >
      <h1 class="text-white text-center">Sign Up</h1>
      <label for="username">Username</label>
      <input
        v-model="username"
        id="username"
        data-test="username"
        type="text"
        placeholder="Username"
      />

      <label for="email">E-mail</label>
      <input
        v-model="email"
        id="email"
        data-test="email"
        type="text"
        placeholder="E-mail"
      />

      <label for="password">password</label>
      <input
        v-model="password"
        id="password"
        data-test="password"
        type="password"
        placeholder="Password"
      />

      <label for="password-repeat">password repeat</label>
      <input
        v-model="passwordrepeat"
        id="password-repeat"
        data-test="password-repeat"
        type="password"
        placeholder="Password repeat"
      />
      <button
        class="submit_btn"
        type="submit"
        :disabled="isDisabled || disabled"
        @click.prevent="submit"
      >
        Sign Up
      </button>
    </form>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, computed } from "vue";

const username = ref("");
const email = ref("");
const password = ref("");
const passwordrepeat = ref("");
const disabled = ref(false);
const isDisabled = computed(() => {
  return password.value && passwordrepeat.value
    ? password.value !== passwordrepeat.value
    : true;
});

const submit = async () => {
  disabled.value = true;
  try {    
    axios.post("/api/1.0/users", {
      username: username.value,
      email: email.value,
      password: password.value,
    });
  } catch (e) {
    console.log(e);
  } 
};
</script>
