<template>
  <div class="task">
    <div v-if="task.tag" class="tag">{{ task.tag }}</div>
    <h4 class="title">{{ task.title }}</h4>
  </div>
</template>

<script setup lang="ts">
import type { ITask } from '@/types'
defineProps<{ task: ITask }>()
</script>

<style scoped>
.task {
  padding: var(--space-m);
  border-radius: var(--radius-m);
  background: #fff;
  box-shadow: rgba(99, 99, 99, 0.05) 0px 2px 8px 0px;
}

.title {
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  margin-top: var(--space-s);
}

.tag {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: var(--space-xs) var(--space-s);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  width: fit-content;
  border-radius: 5px;
  text-transform: uppercase;
  color: #70aecd;
}
</style>
