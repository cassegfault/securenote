<template>
	<div class="note">
		<div v-if="note">
			<h4><router-link class="back-link" :to="{ path:'/notes' }">&laquo;</router-link>Editing: <i>{{ note.data.title }}</i></h4>
			<note_form :note="note" />
		</div>
		<div v-else>
			Loading and Decrypting
		</div>
	</div>
</template>

<script>
import note_form from '@/components/note_form.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
	name: 'note',
	components: {
		note_form
	},
	computed: {
		note() {
			return this.note_by_id(this.$route.params.id);
		},
		...mapGetters({
			note_by_id: 'notes/by_id'
		})
	},
	methods: {
		...mapActions({
			get_note_by_id: 'notes/get_by_id'
		})
	},
	mounted: function(){ this.get_note_by_id(this.$route.params.id); }
};
</script>

<style scoped>
.back-link {
	text-decoration:none;
	color:inherit;
	padding-right:10px;
}
</style>