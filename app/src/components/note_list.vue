<template>
	<ul class="note-list">
		<li v-for="note in notes" :key="note.id">
			<div class="note-title" >{{ note.title }}</div>
			<div class="note-body">{{ note.body }}</div>
		</li>
	</ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	computed: mapGetters({
		notes:'notes/all'
	})
};
</script>

<style scoped>
	
</style>