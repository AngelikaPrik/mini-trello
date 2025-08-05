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
  z-index: 10;
}

.wrapper {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 40%;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

button.danger {
  background: #e53935;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
</style>
