<template>
	<ul class="note-list">
		<li v-for="note in notes" :key="note.id" class="note-title">
			<router-link :to="{ path:'/note/' + note.id }">{{ note.data.title }}</router-link>
		</li>
	</ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	computed: mapGetters({
		notes:'notes/all'
	}),
	methods: {
		...mapActions({
			get_all_notes: 'notes/get_all'
		})
	},
	mounted: function(){ this.get_all_notes(); }
};
</script>

<style scoped>
	
</style>