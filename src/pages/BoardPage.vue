<template>
	<section class='board'>
		<div v-for='col in columns' :key='col.id' class='column'>
			<h2>{{ col.title }}</h2>

			<ul>
				<li v-for='task in col.tasks' :key='task.id'>{{ task.title }}</li>
			</ul>
			<button v-on:click='onAddTask(col.id)'>Добавить задачу</button>
		</div>
		<button v-on:click='onAddColumn'>Добавить колонку</button>
	</section>
</template>

<script setup lang="ts">
	import { useBoardStore } from '@/stores/board';
	const { columns, addColumn, addTask } = useBoardStore();

	const onAddColumn = () => {
		addColumn(prompt('Название колонки?') || 'Без названия');
	}

	const onAddTask = (columnId: string) => {
		addTask(columnId, prompt('Название задачи?') || 'Без названия');
	}
</script>
<style scoped>
	.board {
		display: flex;
		gap: 1rem;
	}

	.column {
		background: #f4f4f4;
		padding: 1rem;
		width: 200px;
		border-radius: 5px;
	}
</style>