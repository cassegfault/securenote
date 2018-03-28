<template>
	<div class="note-form">
		<label class="note-label" for="title">Title</label>
		<input class="note-title" type="text" name="title" v-model="innerNote.data.title" />
		<br>
		<label class="note-label" for="body">Note</label>
		<textarea class="note-body" v-model="innerNote.data.body" name="body" placeholder="add multiple lines"></textarea>
		<div class="actions">
			<button @click="save()">Save Note</button>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	props: ["note"],
	data(){
		return {
			innerNote: JSON.parse(JSON.stringify(this.note))
		};
	},
	computed: mapGetters({
		notes:'notes/all'
	}),
	methods: {
		save(){
			var saveNote = {
				data: JSON.stringify(this.innerNote.data),
				decrypted: true
			};
			if (this.note.hasOwnProperty('id')){
				saveNote.id = this.note.id;
			}
			this.add_note(saveNote);
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

<style scoped lang="less">
.note-label {
	display:block;
	padding:5px 0;
}
.note-title{
	font-size:24px;
}
.note-body{
	display:block;
	width:100%;
	border-radius:5px;
	border-style:solid;
	border-width: 1px;
	padding:5px;
	min-height:24em;
	font-family:inherit;
}
.actions{
	padding:10px 0;
	text-align:right;
}
</style>