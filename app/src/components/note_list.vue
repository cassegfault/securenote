<template>
	<div class="note-list">
		<router-link tag="div" :to="{ path:'/notes/' + note.id }" v-for="note in notes" :key="note.id" class="note-list-item">
			<div class="note-title" >{{ note.data.title }}</div>
			<div class="note-body" v-html="truncate(note.data.body)"></div>
			<div class="actions">
				<span @click="delete_note(note, $event)" class="oi" data-glyph="trash"></span>
			</div>
		</router-link>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

// TODO: Paginate
export default {
	computed: {
		...mapGetters({
			notes:'notes/all'
		})
	},
	methods: {
		delete_note(note,e){
			e.preventDefault();
			this.preform_delete(note);
		},
		...mapActions({
			get_all_notes: 'notes/get_all',
			preform_delete: 'notes/delete'
		}),
		
		truncate(text){
			if(text.length > 240){
				let break_idx = text.substr(240).search(/[^\w]/);
				if(break_idx > 0){
					return text.substr(0,break_idx + 240) + '&hellip;';
				} else {
					return text.substr(0,240) + '&hellip;';
				}
				
			}
			return text;
		}
	},
	mounted(){ 
		this.get_all_notes(); 
	}
};
</script>

<style lang="less" scoped>
.note-list {
	list-style:none;
	margin:0;
	padding: 0;
	display:flex;
	flex-wrap:wrap;
	justify-content: space-between;
}
.note-list.list-display .note-list-item {
	width:100%;
}
.note-list-item {
	padding: 5px;
	min-width: 275px;
	max-width: 275px;
	min-height:100px;
	margin-bottom: 20px;
	position:relative;
	cursor:pointer;
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0,0,0,0.2);
	align-self:flex-start;

	&:hover .actions {
		opacity:1;
	}
	.actions {
		text-align:right;
		position:absolute;
		bottom:0;
		opacity:0;
		padding:5px 0;
		width:100%;
	}
	.note-body {
		max-height:300px;
		overflow:hidden;
		text-overflow:ellipsis;
	}
	.note-title {
		font-weight:800;
	}
}

</style>