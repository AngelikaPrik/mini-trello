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
  padding: 0.5em 1em;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #e0e0e0;
  transition: background 0.2s;
}

.button:hover {
  background: #d5d5d5;
}

.button--primary {
  background-color: #42b983;
  color: white;
}

.button--primary:hover {
  background-color: #36996e;
}

.button--danger {
  background-color: #e53935;
  color: white;
}

.button--danger:hover {
  background-color: #c62828;
}
</style>
