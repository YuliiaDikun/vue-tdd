<template>
  <div class="w-full">
    <label :for="id">{{ label }}</label>
    <input
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      :id="id"
      :data-test="id"
      :type="id=== 'password' ? 'password' : 'text'"
      :placeholder="label"
    />
    <span
      v-if="help !== undefined"
      class="test-left text-sx text-red-600"
      data-test="error-name"
    >
      {{ help }}
    </span>
  </div>
</template>
<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  label: {
    type: String,
  },
  id: {
    type: String,
  },
  help: {
    type: String || undefined,
  },
  modelValue: {
    type: String,
  },
});


</script>
