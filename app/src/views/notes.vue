<template>
  <div class="notes">
    <h1>Your Notes</h1>
    <button @click="toggleForm()">Add A Note</button>
    <div v-if="show_form">
    	<note_form v-if="show_form" />	
    </div>
	
    <note_list />
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
  		show_form: false
  	};
  },
  methods:{
  	toggleForm(){
  		this.show_form = !this.show_form;
  	}
  }
};	
</script>

<style>
	
</style>