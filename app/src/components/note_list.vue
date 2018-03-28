<template>
	<ul class="note-list">
		<router-link tag="li" :to="{ path:'/notes/' + note.id }" v-for="note in notes" :key="note.id" class="note-list-item">
			<span class="note-title-link" >{{ note.data.title }}</span>
		</router-link>
	</ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

// TODO: Paginate

export default {
	computed: mapGetters({
		notes:'notes/all'
	}),
	methods: {
		...mapActions({
			get_all_notes: 'notes/get_all'
		})
	},
	mounted: function(){ 
		this.get_all_notes(); 
	}
};
</script>

<style lang="less" scoped>
.note-list {
	list-style:none;
	margin:0;
	padding: 0;
}

.note-list-item {
	padding: 5px 0;
	&:hover {
		background-color:#FFFC;
		cursor:pointer;
	}
}

.note-title-link {
	color: inherit;
	text-decoration: none;
}

</style>