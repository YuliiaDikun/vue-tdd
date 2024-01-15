<template>
  <div class="px-5 pt-10 max-w-6xl mx-auto">
    <nav class="w-full flex items-center border-b-2 border-slate-600">
      <router-link
        class="block text-xl font-medium p-2 text-slate-200"
        title="home"
        data-test="homeLink"
        to="/"
        >Home</router-link
      >
      <ul
        class="ml-auto flex items-center justify-between md:justify-end gap-[18px]"
      >
        <li>
          <router-link
            :class="path === '/signup' ? 'underline underline-offset-8' : ''"
            class="block p-2 text-slate-300"
            title="signup"
            data-test="signupLink"
            to="/signup"
            >{{ $t("signUp") }}</router-link
          >
        </li>
        <li>
          <router-link
            :class="path === '/login' ? 'underline underline-offset-8' : ''"
            class="block p-2 text-slate-300"
            title="login"
            data-test="loginLink"
            to="/login"
            >{{ $t("login") }}</router-link
          >
        </li>
      </ul>
    </nav>

    <Language />
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Language from "./components/Language.vue";

const path = ref(window.location.pathname);

const onClickLink = (event) => {
  path.value = event.target.attributes.href.value;
  window.history.pushState({}, "", path.value);
};
</script>
