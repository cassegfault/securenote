<template>
	<div class="note-form">
		<label for="title">Title</label>
		<input type="text" name="title" v-model="title" />
		<br>
		<label for="body">Note</label>
		<textarea v-model="body" name="body" placeholder="add multiple lines"></textarea>
		<button @click="save()">Save Note</button>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	data() {
		return {
			body:'',
			title:''
		};
	},
	computed: mapGetters({
		notes:'notes/all'
	}),
	methods: {
		save(){
			var data = {
				title: this.title,
				body: this.body
			};
			this.add_note({
				data: data,
				decrypted: true
			})
		},
		...mapActions({
			add_note: 'notes/add_note'
		})
	}
};
</script>

<style scoped>
	
</style>