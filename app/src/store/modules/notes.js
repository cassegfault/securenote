import API from '@/api/api.js';

export const state = {
	all: []
};

export const getters = {
	all: (state) => state.all,
	by_id: (state) => (id) => {
		return state.all.find((note) => note.id == id);
	}
};

export const mutations = {
	set_notes(state, { notes }) {
		state.all = notes;
	},
	add_note(state, { note }) {
		state.all.push(note);
	},
	update_note(state, { note }) {
		var note_idx = state.all.findIndex((old_note) => old_note.id == note.id);
		if (note_idx > -1) {
			state.all[note_idx] = note;
		} else {
			state.all.push(note);
		}
	},
	remove_note(state, { note }) {
		var note_idx = state.all.findIndex((old_note) => old_note.id == note.id);
		if (note_idx > -1) {
			state.all.splice(note_idx,1);
		}
	}
};

function encrypt_note(note, user_key) {
	return asmCrypto.bytes_to_hex(
		asmCrypto.AES_CBC.encrypt(asmCrypto.string_to_bytes(note.data),
			user_key.toBytes(),
			true,
			asmCrypto.hex_to_bytes(note.iv)
		)
	);
}

function decrypt_note(note, user_key) {
	if (!note.data || note.data.length < 1)
		return {};
	var decrypted = asmCrypto.bytes_to_string(
		asmCrypto.AES_CBC.decrypt(asmCrypto.hex_to_bytes(note.data),
			user_key.toBytes(),
			true,
			asmCrypto.hex_to_bytes(note.iv)
		)
	);
	try {
		return JSON.parse(decrypted);
	} catch (e) {
		console.error(e);
		return null;
	}
}

export const actions = {
	get_all({ commit, rootGetters }) {
		var user_key = rootGetters['user/_private_key'];
		return API.get('/notes').then(({ notes }) => {
			commit('set_notes', { notes });
			for (let idx in notes) {
				let note = { ...notes[idx] };
				note.data = decrypt_note(note, user_key);
				note.decrypted = true;
				commit('update_note', { note });
			}
		})
		/*.catch(() => {
					console.log('get notes failed')
					commit('set_notes', { notes: [] });
				});*/
	},
	get_by_id({ commit, rootGetters }, id) {
		var user_key = rootGetters['user/_private_key'];
		return API.get(`/notes/${id}`).then((note) => {
			note.data = decrypt_note(note, user_key);
			note.decrypted = true;
			commit('update_note', { note });
		})
		/*.catch(() => {
					console.log('get notes failed')
					commit('set_notes', { notes: [] });
				});*/
	},
	delete({commit},note){ 
		return API.delete(`/notes/${note.id}`).then(()=>{
			commit('remove_note',{ note });
		});
	},
	add_note({ commit, rootGetters }, { note, callback }) {
		var user_key = rootGetters['user/_private_key'],
			new_note = !note.hasOwnProperty('id');

		// Whether we're updating or adding, we need a new IV
		note.iv = asmCrypto.bytes_to_hex(asmCrypto.getRandomValues(new Uint8Array(16)));

		if (note.decrypted) {
			note.data = encrypt_note(note, user_key);
			note.decrypted = false;
		}
		if (new_note) {
			return API.put('/notes', {
				data: note.data,
				iv: note.iv
			}).then((noteJSON) => {
				var note = {
					id: noteJSON.id,
					iv: noteJSON.iv,
					data: decrypt_note(noteJSON, user_key),
					decrypted: true
				}
				commit('add_note', { note });
				if (callback){
					callback.bind(this)(note);
				}
			}).catch(() => {
				// TODO: global error state for reporting to user
			});
		} else {
			return API.post(`/notes/${note.id}`, {
				id: note.id,
				data: note.data,
				iv: note.iv
			}).then((noteJSON) => {
				var note = {
					id: noteJSON.id,
					iv: noteJSON.iv,
					data: decrypt_note(noteJSON, user_key),
					decrypted: true
				}
				commit('add_note', { note });
				if (callback)
					callback(note);
			}).catch(() => {
				// TODO: global error state for reporting to user
			});
		}
	}
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}