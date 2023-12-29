<template>
  <div class="px-5 pt-10 max-w-6xl mx-auto">
    <nav class=" w-full border-b-2 border-slate-600">
      <ul class="flex items-center justify-between md:justify-end gap-[18px]">
        <li>
          <a
          :class="path === '/'? 'underline underline-offset-8':''"
          class="block p-2 text-slate-300" @click.prevent="onClickLink" title="home" data-test="homeLink"
            href="/">Home</a>
        </li>
        <li>
          <a 
          :class="path === '/signup'? 'underline underline-offset-8':''" 
          class="block p-2 text-slate-300 " @click.prevent="onClickLink" title="signup" data-test="signupLink"
            href="/signup">{{ $t("signUp") }}</a>
        </li>
        <li>
          <a 
          :class="path === '/login'? 'underline underline-offset-8':''"
          class="block p-2 text-slate-300 " @click.prevent="onClickLink" title="login" data-test="loginLink"
            href="/login">{{ $t("login") }}</a>
        </li>
      </ul>
    </nav>

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
  window.history.pushState({}, "", path.value);
};
</script>
