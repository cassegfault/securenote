<template>
	<div class="login-container">
		<div class="login-error" v-if="showLoginError">
			<span v-if="fields_empty">
				Username and password are required.
			</span>
			<span v-else>
				Either Username or Password are incorrect.	
			</span>
		</div>
		<div class="login-form">
			<label class="login-label" for="username">Username</label>
			<input class="login-field" type="text" name="username" v-model="username" @focus="clear_error()" />
			<br>
			<label class="login-label" for="password">Password</label>
			<input class="login-field" type="password" name="password" v-model="password" @focus="clear_error()" />
			
			<div class="actions">
				<button class="sign-up" @click="create_user">Sign Up</button>
				<button class="sign-in" @click="login">Sign In</button>
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
	computed: {
		fields_empty(){
			return this.username.length < 1 || this.password.length < 1;
		}
	},
	methods: {
		clear_error(){
			this.showLoginError = false;
		},
		login() {
			if(this.fields_empty){
				this.showLoginError = true;
				return;
			}
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
.login-container{
	max-width: 300px;
	margin:0 auto;
	
}
.login-label {
	display:block;
	padding:5px 0 10px 0;
}
.login-field{
	width:100%;
}
.login-error{

}
.actions {
	text-align:right;
	padding:10px 0;
}
.sign-up{
	margin-right:25px;
}
.sign-in{
	background-color:#00e74c;
	&:hover {
		background-color: #1cd559;
	}
}
.login-error{
	padding:10px;
	background-color: #ff252580;
	border: 1px solid #c95858;
	display: block;
	text-align: center;
	color: #773434;
}
</style>
