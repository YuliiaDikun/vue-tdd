<template>
  <div class="mt-6 flex items-center justify-end gap-[18px]">
    <img
      class="cursor-pointer"
      @click="$i18n.locale = 'uk'"
      data-test="uk"
      title="Україська"
      src="https://flagsapi.com/UA/flat/24.png"
    />

    <img
      class="cursor-pointer"
      @click="$i18n.locale = 'en'"
      data-test="en"
      title="English"
      src="https://flagsapi.com/GB/flat/24.png"
    />
  </div>
</template>
<script setup></script>
