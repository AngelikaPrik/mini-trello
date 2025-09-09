<template>
  <div
    class="modal"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    @click.self="onBackdrop"
  >
    <div class="wrapper">
      <header class="header">
        <slot name="title">
          <h3 :id="titleId">Подтверждение</h3>
        </slot>
        <button class="close" type="button" @click="$emit('close')" aria-label="Закрыть">×</button>
      </header>

      <div class="content">
        <slot />
      </div>

      <form class="actions" @submit.prevent="onConfirm">
        <button type="button" @click="$emit('cancel')">
          {{ cancelText }}
        </button>

        <button
          v-if="showConfirm"
          :class="['confirm', confirmVariantClass]"
          type="submit"
          :disabled="confirmDisabled || loading"
        >
          <span v-if="!loading">{{ confirmText }}</span>
          <span v-else>…</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps<{
  showConfirm?: boolean
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'danger' | 'primary' | 'default'
  confirmDisabled?: boolean
  loading?: boolean
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  labelledById?: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const titleId = computed(() => props.labelledById || 'ui-modal-title')

const confirmVariantClass = computed(() => {
  switch (props.confirmVariant) {
    case 'danger':
      return 'confirm--danger'
    case 'primary':
      return 'confirm--primary'
    default:
      return 'confirm--default'
  }
})

function onBackdrop() {
  if (props.closeOnBackdrop !== false) emit('close')
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc !== false) emit('close')
}
function onConfirm() {
  emit('confirm')
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-index-modal);
}

.wrapper {
  background: var(--color-bg);
  padding: var(--space-l);
  border-radius: var(--radius-m);
  width: 40%;
  color: var(--color-text);
  font-family: var(--font-base);
  font-size: var(--font-size-m);
  display: flex;
  flex-direction: column;
  row-gap: var(--space-m);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-m);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
  padding: 4px;
  border-radius: 6px;
}
.close:hover {
  background: rgba(0, 0, 0, 0.05);
}

button {
  font-size: var(--font-size-s);
  font-family: inherit;
  padding: var(--space-xs) var(--space-m);
  border: none;
  border-radius: var(--radius-s);
  background: var(--color-gray-300);
  color: var(--color-text);
  cursor: pointer;
}

button:hover {
  background: var(--color-gray-500);
}

button.danger {
  background: var(--color-danger);
  color: white;
}

button.primary {
  background: var(--color-primary);
  color: white;
}

button.danger:hover {
  background: #d03b3b;
}
</style>
