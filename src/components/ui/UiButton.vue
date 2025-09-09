<template>
  <button
    type="button"
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

defineEmits<{
  (e: 'click'): void
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
  background: #ffffffa7;
  color: var(--color-text);
  transition: background 0.2s ease;

  display: flex;
  justify-content: center;
  align-items: center;
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
