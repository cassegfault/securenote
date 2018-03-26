import API from '@/api/api.js';

const LS_USER_KEY = 'securenote-user-key';

export const state = {
	is_authenticated: false,
	_private_key: asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes(window.localStorage.getItem(LS_USER_KEY)))
};

export const getters = {
	is_authenticated: (state) => state.is_authenticated,
	_private_key: (state) => {
		// TODO: Secure local storage (no writes to disk)
		return state._private_key;
	}
};

export const mutations = {
	set_is_authenticated(state, { value }){
		state.is_authenticated = value;
	},
	set_private_key(state, {key}){
		window.localStorage.setItem(LS_USER_KEY,key);
		state._private_key = asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes(key.toString()));
	}
};

export const actions = {
	check_authentication: ({ commit }) => {
		API.get_endpoint('/info')
			.then( () => {
				console.log('authenticated');
				commit('set_is_authenticated', { value: true } ) 
			})
			.catch(() => {
				console.log('not authenticated');
				commit('set_is_authenticated', { value: false })
			});
	},
	set_private_key({commit}, key){
		commit('set_private_key',{key});
	},
	logout: ({ commit }) => {
		API.delete('/authentication').then(()=>{
			commit('set_is_authenticated', false);
		}).fail(()=>{
			commit('set_is_authenticated', false);
		});
	}
};

export default {
	namespaced:true,
	state,
	getters,
	mutations,
	actions
}