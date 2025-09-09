<template>
  <input
    type="text"
    class="input"
    :class="{ 'input--error': error }"
    v-bind="$attrs"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  error?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.input {
  padding: var(--space-s) var(--space-m);
  font-size: var(--font-size-s);
  font-family: var(--font-base);
  border: 1px solid #ccc;
  border-radius: var(--radius-s);
  outline: none;
  transition: border-color 0.2s ease;
  background: white;
  color: var(--color-text);
  width: 100%;
}

.input:focus {
  border-color: var(--color-primary);
}

.input--error {
  border-color: var(--color-danger);
}
</style>
