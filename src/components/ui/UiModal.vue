<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="wrapper">
      <slot name="title"><h3>Подтверждение</h3></slot>
      <div class="content">
        <slot />
      </div>
      <div class="actions">
        <button @click="$emit('cancel')">Отмена</button>
        <button class="danger" @click="$emit('confirm')">Удалить</button>
      </div>
    </div>
  </div>
</template>

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
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-m);
  margin-top: var(--space-m);
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

button.danger:hover {
  background: #d03b3b;
}
</style>
