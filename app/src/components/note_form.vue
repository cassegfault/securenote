<template>
	<div class="note-form">
		<div v-if="false">
		<label class="note-label" for="title">Title</label>
		<input class="note-title" type="text" name="title" v-model="innerNote.data.title" />
		<br>
		<label class="note-label" for="body">Note</label>
		<textarea class="note-body" v-model="innerNote.data.body" name="body" placeholder="add multiple lines"></textarea>
		<div class="actions">
			<button @click="save()">Save Note</button>
		</div>
		</div>

		<input 
			ref="noteTitle"
			v-model="innerNote.data.title"
			placeholder="Title" 
			class="note-title" 
			type="text" 
			v-if="form_extended"
			@focus="form_focused('title')"
			@blur="form_blurred()" />
		<textarea 
			ref="noteBody"
			:class="['note-body', form_extended ? 'extended' : '']" 
			placeholder="Take a note..." 
			v-model="innerNote.data.body" 
			@focus="form_focused('body')" 
			@blur="form_blurred()"></textarea>
		<div class="actions" v-if="form_extended">
			<button class="done-button" @click="save()">DONE</button>
		</div>

	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { extend, debounce } from '@/utils.js'

export default {
	props: ["note"],
	data(){
		var note_copy = extend({
			data: {
				title: "",
				body: ""
			}
		},this.note);
		return {
			form_extended: false,
			innerNote: note_copy,
			focus: null
		};
	},
	computed: {
		...mapGetters({
			notes:'notes/all'
		})
	},
	methods: {
		save: debounce(function save(callback){
			var saveNote = extend({}, this.innerNote);
			saveNote = extend(saveNote,{
				data: JSON.stringify(saveNote.data),
				decrypted: true
			});
			this.add_note({
				note:saveNote,
				callback:(noteJSON)=>{
					this.innerNote.id = noteJSON.id;
					callback.bind(this)();
				}
			});
		},500),
		clear_form(){
			this.innerNote = { data: {} };
			this.$refs.noteBody.value = '';
			this.$refs.noteTitle.value = '';
		},
		form_focused(element){
			this.form_extended = true;
			this.focus = element;
			if(element == 'body'){
				this.$nextTick(()=>{
					this.$refs.noteBody.focus();
				});
			}
		},
		form_blurred(){
			this.focus = null;
			this.$nextTick(function formBlurred(){
				if(this.focus)
					return;
				if (this.innerNote && (this.innerNote.data.title.length || this.innerNote.data.body.length)){
					this.save(function() { this.clear_form() });
					this.form_extended = false;
				} else {
					this.form_extended = false;
				}
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

<style scoped lang="less">
.note-form {
	text-align:left;
	background-color:#fff;
}
.note-label {
	display:block;
	padding:5px 0;
}
.note-title{
	font-size:24px;
	font-weight:500;
	border:none;
}
.note-body{
	display:block;
	width:100%;
	border:none;
	padding:5px;
	min-height:2em;
	font-family:inherit;
	resize:none;
}
.note-body.extended {
	min-height:7em;
}
.actions{
	padding:5px 10px;
	text-align:right;
}
.done-button{
	background-color:#00000000;
	color:#000;
	font-weight:bold;
	margin:0;
	&:hover {
		background-color:#00000022;
	}
}
</style>