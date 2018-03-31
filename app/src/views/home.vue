<template>
  <div class="home">
    Welcome to SecureNote
  </div>
</template>

<script>

export default {
  name: 'home',
  mounted: function(){
  	this.$router.push({path: '/notes'});
  }
};
</script>
