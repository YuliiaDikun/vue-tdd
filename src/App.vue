<template>
<div class="px-5 pt-10  max-w-6xl mx-auto">
    <Language/>
    <SignUp v-if="path === '/signup'"/>
    <HomePage v-if="path === '/'"/>
</div>
</template>

<script setup>
import { ref, computed } from "vue";
import HomePage from "./pages/HomePage.vue";
import SignUp from "./pages/SignUp.vue";
import Language from './components/Language.vue';

const path = computed(() => window.location.pathname);

</script>
