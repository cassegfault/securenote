import API from '@/api/api.js';

const LS_USER_KEY = 'securenote-user-key';
const LS_USER_NAME = 'securenote-user-name';

export const state = {
	is_authenticated: false,
	_private_key: window.localStorage.getItem(LS_USER_KEY) ? asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes(window.localStorage.getItem(LS_USER_KEY))) : null,
	username: window.localStorage.getItem(LS_USER_NAME) ? window.localStorage.getItem(LS_USER_NAME) : null,
};

export const getters = {
	is_authenticated: (state) => state.is_authenticated,
	_private_key: (state) => {
		// TODO: Secure local storage (no writes to disk)
		return state._private_key;
	},
	username: (state) => {
		return state.username;
	}
};

export const mutations = {
	set_is_authenticated(state, { value }) {
		state.is_authenticated = value;
	},
	set_private_key(state, { key }) {
		window.localStorage.setItem(LS_USER_KEY, key);
		if(key){
			state._private_key = asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes(key.toString()));
		}
	},
	set_username(state, { key }) {
		window.localStorage.setItem(LS_USER_NAME, key);
		state.username = key;
	}
};

export const actions = {
	check_authentication: ({ commit, state }) => {
		if(state._private_key){
			API.get_endpoint('/info')
				.then(() => {
					commit('set_is_authenticated', { value: true });
				})
				.catch(() => {
					commit('set_is_authenticated', { value: false });
				});
			} else {
				commit('set_is_authenticated', { value: false });
			}
	},
	set_private_key({ commit }, key) {
		commit('set_private_key', { key });
	},
	set_username({ commit }, key) {
		commit('set_username', { key });
	},
	logout: ({ commit }) => {
		commit('set_private_key','');
		commit('set_username','');
		API.delete('/authentication').then(() => {
			commit('set_is_authenticated', false);
		}).catch(() => {
			commit('set_is_authenticated', false);
		});
	}
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}