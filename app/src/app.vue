<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> | 
      <router-link to="/notes">Notes</router-link> | 
      <a @click="logout">Logout</a>
    </div>
    <div v-if="!is_authenticated">
      <login_form />
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import login_form from '@/components/login_form.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'app',
  components: {
    login_form,
  },
  computed: mapGetters({ is_authenticated: 'user/is_authenticated' }),
  methods: mapActions({check_authentication: 'user/check_authentication', logout: 'user/logout'}),
  mounted: function(){ this.check_authentication(); }
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
