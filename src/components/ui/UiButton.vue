<template>
  <button
    class="ui-button"
    :class="{ 'ui-button--primary': primary, 'ui-button--danger': danger }"
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
.ui-button {
  padding: 6px 12px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #e0e0e0;
  transition: background 0.2s;
}

.ui-button:hover {
  background: #d5d5d5;
}

.ui-button--primary {
  background-color: #42b983;
  color: white;
}

.ui-button--primary:hover {
  background-color: #36996e;
}

.ui-button--danger {
  background-color: #e53935;
  color: white;
}

.ui-button--danger:hover {
  background-color: #c62828;
}
</style>
