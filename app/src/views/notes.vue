<template>
	<div class="notes">
		<h1 class="page-title">Your Notes</h1>
		<div class="actions">
			<button class="add-note" @click="toggleForm()">Add A Note</button>
		</div>
		<div v-if="show_form">
			<note_form :note="{ data:empty_note.data }" v-if="show_form" />	
		</div>
		<div v-else>
			<note_list />
		</div>
	</div>
</template>

<script>
import note_list from '@/components/note_list.vue';
import note_form from '@/components/note_form.vue';

export default {
	name: 'notes',
	components: {
		note_list,
		note_form
	},
	data(){
		return {
			show_form: false,
			empty_note: { 
				data: {
					title: '',
					body: ''
				}
			}
		};
	},
	methods:{
		toggleForm(){
			this.show_form = !this.show_form;
		}
	}
};
</script>

<style scoped>
.page-title {
	margin:0;
}
.actions {
	text-align:right;
}
</style>