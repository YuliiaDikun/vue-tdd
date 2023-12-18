<template>
  <div class="w-full">
    <label :for="id">{{ label }}</label>
    <input
      :class="help !== undefined ? 'border-red-500' : 'border-gray-300'"
      :value="modelValue"
      @input="onInputChange"
      :id="id"
      :data-test="id"
      :type="id === 'password' ? 'password' : 'text'"
      :placeholder="label"
    />
    <span
      v-if="help !== undefined"
      class="test-left text-sm text-red-300"
      :data-test="`error-${id}`"
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

const onInputChange = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>
