<template>
<div class="px-5 pt-10  max-w-6xl mx-auto">
    <Language/>
    <SignUp v-if="path === '/signup'"/>
    <HomePage v-else-if="path === '/'"/>
    <Login  v-else-if="path === '/login'"/>
    <User v-else-if="path.startsWith('/user/')"/>
</div>
</template>

<script setup>
import { ref, computed } from "vue";
import HomePage from "./pages/HomePage.vue";
import SignUp from "./pages/SignUp.vue";
import Login from "./pages/Login.vue";
import User from './pages/User.vue';
import Language from './components/Language.vue';

const path = computed(() => window.location.pathname);

</script>
