<template>
<div id="app">
	<title_bar />
	<div v-if="!is_authenticated">
		<login_form />
	</div>
	<div class="page-container" v-else>
		<router-view />
	</div>
	<app_footer />
</div>
</template>

<script>
import login_form from '@/components/login_form.vue';
import title_bar from '@/components/title_bar.vue';
import app_footer from '@/components/footer.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
	name: 'app',
	components: {
		login_form,
		title_bar,
		app_footer
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
	color: #2c3e50;
}
#nav {
	text-align:center;
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
<style src="@/assets/style.css"></style>
