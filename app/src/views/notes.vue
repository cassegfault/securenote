<template>
	<div class="notes">
		<div class="actions">
			<note_form clear_on_blur="true"/>
		</div>
		<note_list />
	</div>
</template>

<script>
import note_list from '@/components/note_list.vue';
import note_form from '@/components/note_form.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'notes',
	components: {
		note_list,
		note_form
	},
	methods:{
		...mapActions({
			add_note: 'notes/add_note'
		}),
		addNote(){
			this.add_note({
				data: ''
			}, (note)=>{
				this.$router.push({ path:`/notes/${note.id}`});
			});
		}
	}
};
</script>

<style scoped>
.page-title {
	margin:0;
}
.actions {
	max-width:500px;
	text-align:right;
	margin:0 auto 20px auto;
}
</style>