<template>
	<div :class="['note-form', always_expand ? 'large-form' : '']">
		<input 
			ref="noteTitle"
			v-model="innerNote.data.title"
			placeholder="Title" 
			class="note-title" 
			type="text" 
			v-if="show_extended_form"
			@focus="form_focused('title')"
			@blur="form_blurred()" />
		<div 
			contenteditable="true" 
			ref="noteBody"
			:class="['note-body', editingBody.length ? '' : 'empty', show_extended_form ? 'extended' : '']" 
			placeholder="Take a note..."
			v-html="editingBody"
			@input="body_input($event)" 
			@focus="form_focused('body')" 
			@blur="form_blurred()"></div>
		<div class="actions" v-if="show_extended_form">
			<button class="done-button" @click="save()">DONE</button>
		</div>

	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { extend, debounce } from '@/utils.js'

export default {
	props: [ "note", "always_expand", "clear_on_blur" ],
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
			focus: null,
			editingBody: note_copy.data.body
		};
	},
	computed: {
		show_extended_form() {
			return this.form_extended || this.always_expand;
		},
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
		body_input(e){
			this.innerNote.data.body = e.target.innerHTML;
		},
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
					this.save(function() {
						if(this.clear_on_blur){ 
							this.clear_form();
						}
					});
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
	box-shadow: 0 3px 5px rgba(0,0,0,0.2);
}
.note-form.large-form {
	box-shadow:none;
}
.note-label {
	display:block;
	padding:5px 0;
}
.note-title{
	font-size:24px;
	font-weight:500;
	width:100%;
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
	&.empty::before {
		content:'Type a note...';
	}
	&:active, &:focus {
		border:none;
		outline:none;
	}
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