<template>
	<div class="note-form">
		<label for="title">Title</label>
		<input type="text" name="title" v-model="note.data.title" />
		<br>
		<label for="body">Note</label>
		<textarea v-model="note.data.body" name="body" placeholder="add multiple lines"></textarea>
		<button @click="save()">Save Note</button>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	props: ["note"],
	computed: mapGetters({
		notes:'notes/all'
	}),
	methods: {
		save(){
			this.add_note({
				data: JSON.stringify(this.note.data),
				decrypted: true
			})
		},
		...mapActions({
			add_note: 'notes/add_note'
		})
	},
	watch: {
		note: function(value){
			this.note = value;
		}
	}
};
</script>

<style scoped>
	
</style>