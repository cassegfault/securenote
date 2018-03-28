<template>
	<div class="login-container">
		<div class="login-error" v-if="errorMessage">
			{{errorMessage}}
		</div>
		<div class="create-success" v-if="showCreatedSuccess">
			User created successfully, please log in
		</div>
		<div class="login-form">
			<label class="login-label" for="username">Username</label>
			<input class="login-field" type="text" name="username" v-model="username" @focus="clear_error()" :disabled="disableForm" />
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

const messages = {
	no_credentials:  "Username and password are required.",
	bad_credentials: "Either Username or Password are incorrect.",
	error_creating:  "There was an error creating your account, please try again.",
};

export default {
	name: 'login_form',
	props: {	},
	data() {
		return {
			username: '',
			password: '',
			disableForm:false,
			errorMessage: false,
			showCreatedSuccess: false
		}
	},
	methods: {
		clear_error(){
			this.errorMessage = false;
		},
		login() {
			if(this.username.length < 1 || this.password.length < 1){
				this.errorMessage = messages.no_credentials;
				return;
			}
			this.disableForm = true;
			this.errorMessage = false;
			var ua = new UserAuth();
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
					this.disableForm = false;
				} else {
					this.errorMessage = messages.bad_credentials;
					this.disableForm = false;
				}
			};
			var auth_failed = () => { 
				this.disableForm = false;
				this.errorMessage = messages.bad_credentials; 
			};

			ua.login(this.username, this.password).then(handleLogin).catch(auth_failed);
		},
		create_user(){
			this.disableForm = true;
			UserAuth.create_user(this.username, this.password).then(()=>{
				this.disableForm = false;
				this.showCreatedSuccess = true;
			}).catch(()=>{
				this.disableForm = false;
				this.errorMessage = messages.error_creating;
			});
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
