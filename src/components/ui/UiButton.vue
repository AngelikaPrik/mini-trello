<template>
  <button
    class="button"
    :class="{ 'button--primary': primary, 'button--danger': danger }"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  primary?: boolean
  danger?: boolean
}>()
</script>

<style scoped>
.button {
  padding: var(--space-s) var(--space-m);
  font-size: var(--font-size-s);
  font-family: var(--font-base);
  border: none;
  border-radius: var(--radius-s);
  cursor: pointer;
  background: var(--color-gray-300);
  color: var(--color-text);
  transition: background 0.2s ease;
}

.button--primary {
  background-color: var(--color-primary);
  color: white;
}

.button--danger {
  background-color: var(--color-danger);
  color: white;
}

.button--danger:hover {
  filter: brightness(0.9);
}
</style>
