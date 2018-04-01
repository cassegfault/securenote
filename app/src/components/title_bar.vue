<template>
<nav class="title-bar">
	<div class="title-bar-container page-container">
		<div class="title-bar-left">
			<span class="title">SecureNote</span>	
		</div>
		<div class="title-bar-right" v-if="is_authenticated">
			<div class="divider"></div>
			<span class="account-options">
				{{ username }}
				<ul class="account-options-menu" ref="accountList">
					<li class="account-options-menu-item">
						<a @click="logout">Logout</a>		
					</li>
				</ul>
			</span>
		</div>
	</div>
</nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
	name: 'titleBar',
	computed: mapGetters({ 
		is_authenticated: 'user/is_authenticated', 
		username: 'user/username'
	}),
	methods: mapActions({ 
		logout: 'user/logout'
	}),
}
</script>

<style scoped lang="less">
.title-bar{
	background-color:#263238;
	margin-bottom:40px;
	padding:15px 0;
	color:#fff;
}
.title-bar-container{
	display:flex;
}
.title-bar-left,
.title-bar-right {
	width:50%;
	flex-grow:1;
	line-height:100%;
	vertical-align: baseline;
}
.title-bar-right {
	text-align:right;
}
.account-options {
	position:relative;
	cursor:pointer;
	&:hover .account-options-menu {
		display:inline-block;

		&::before {
			content:' ';
			width: 0;
			height: 0;
			border-style: solid;
			border-width: 0 7px 7px 7px;
			border-color: transparent transparent rgba(255,255,255,0.9) transparent;
			right:15px;
			bottom:100%;
			position:absolute;
		}
	}
}
.account-options .account-options-menu {
	color:#333;
	display:none;
	position:absolute;
	list-style:none;
	padding:0;
	margin:0;
	right:0;
	top:28px;
	min-width:150px;
	background-color:#fff;
	box-shadow: 0px 5px 5px rgba(0,0,0,0.3);
	border-radius:2px;
}
.account-options-menu-item{
	padding:5px;
}

</style>