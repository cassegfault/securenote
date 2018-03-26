<template>
	<div>
		<div v-if="showLoginError">There was a problem while logging in.</div>
		<div class="login-form">
			<label for="username">Username</label>
			<input type="text" name="username" v-model="username" />
			<br>
			<label for="password">Password</label>
			<input type="password" name="password" v-model="password" />
			
			<div>
				<button v-on:click="create_user">Sign Up</button>
				<button v-on:click="login">Sign In</button>
			</div>
		</div>
	</div>
</template>

<script>
import UserAuth from '../services/srp.js';
import { mapActions } from 'vuex';
export default {
	name: 'login_form',
	props: {	},
	data() {
		return {
			username: '',
			password: '',
			showLoginError:false
		}
	},
	methods: {
		login() {
			var ua = new UserAuth();
			this.showLoginError = false;
			var handleLogin = (res) => {
				var salt = res.salt,
					server_ephemeral = res.server_ephemeral;
				ua.send_proof(salt, server_ephemeral, res.auth_session).then(handleProof).catch(auth_failed);
			};

			var handleProof = (res) => {
				ua.check_proof(res.server_proof);
				if(ua.authenticated){
					// continue
					this.check_authentication();
					this.set_private_key(ua.private_key);
				} else {
					console.log(ua);
					this.showLoginError = true;
				}
			};
			var auth_failed = () => { console.log('promise error'); this.showLoginError = true; };

			ua.login(this.username, this.password).then(handleLogin).catch(auth_failed);
		},
		create_user(){
			UserAuth.create_user(this.username, this.password);
		},
		...mapActions({ check_authentication:'user/check_authentication', set_private_key:'user/set_private_key' })
	}
};
</script>

<style scoped lang="less">
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
