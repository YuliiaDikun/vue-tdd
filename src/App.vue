<template>
  <div class="px-5 pt-10 max-w-6xl mx-auto">
    <a @click.prevent="onClickLink" title="home" data-test="homeLink" href="/">Home</a>
    <a @click.prevent="onClickLink" title="signup" data-test="signupLink" href="/signup"
      >{{ $t("signUp") }}</a
    >
    <a @click.prevent="onClickLink" title="login" data-test="loginLink" href="/login"
      >{{ $t("login") }}</a
    >
    <Language />
    <SignUp v-if="path === '/signup'" />
    <HomePage v-else-if="path === '/'" />
    <Login v-else-if="path === '/login'" />
    <User v-else-if="path.startsWith('/user/')" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import HomePage from "./pages/HomePage.vue";
import SignUp from "./pages/SignUp.vue";
import Login from "./pages/Login.vue";
import User from "./pages/User.vue";
import Language from "./components/Language.vue";

const path = ref(window.location.pathname);

const onClickLink = (event) => {
  path.value = event.target.attributes.href.value;
  window.history.pushState({}, '', path.value);
};
</script>
