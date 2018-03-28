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
    }
};

function encrypt_note(note, user_key){
	return asmCrypto.bytes_to_hex(
				asmCrypto.AES_CBC.encrypt(asmCrypto.string_to_bytes(note.data), 
											user_key.toBytes(), 
											true, 
											asmCrypto.hex_to_bytes(note.iv)
											)
			);
}
function decrypt_note(note, user_key){
	return JSON.parse(
				asmCrypto.bytes_to_string(
					asmCrypto.AES_CBC.decrypt(asmCrypto.hex_to_bytes(note.data), 
												user_key.toBytes(), 
												true, 
												asmCrypto.hex_to_bytes(note.iv)
												)
				)
			);
}

export const actions = {
    get_all({ commit, rootGetters }) {
        var user_key = rootGetters['user/_private_key'];
        API.get('/notes').then((notes) => {
            commit('set_notes', { notes });
            for (let idx in notes) {
                let note = { ...notes[idx] };
                note.data = decrypt_note(note, user_key);
                note.decrypted = true;
                commit('update_note', { note });
            }
        })/*.catch(() => {
            console.log('get notes failed')
            commit('set_notes', { notes: [] });
        });*/
    },
    get_by_id({ commit, rootGetters }, id) {
        var user_key = rootGetters['user/_private_key'];
        API.get(`/notes/${id}`).then((note) => {
            note.data = decrypt_note(note, user_key);
            note.decrypted = true;
            commit('update_note', { note });
        })/*.catch(() => {
            console.log('get notes failed')
            commit('set_notes', { notes: [] });
        });*/
    },
    add_note({ commit, rootGetters }, note_obj) {
        var user_key = rootGetters['user/_private_key'],
        	new_note = !note_obj.hasOwnProperty('id');

        // Whether we're updating or adding, we need a new IV
        note_obj.iv = asmCrypto.bytes_to_hex(asmCrypto.getRandomValues(new Uint8Array(16)));

        if (note_obj.decrypted) {
            note_obj.data = encrypt_note(note_obj,user_key);
            note_obj.decrypted = false;
        }
        if(new_note){
			API.put('/notes', {
	            data: note_obj.data,
	            iv: note_obj.iv
	        }).then((noteJSON) => {
	            var note = {
	                id: noteJSON.id,
	                iv: noteJSON.iv,
	                data: decrypt_note(noteJSON, user_key),
	                decrypted: true
	            }
	            commit('add_note', { note });
	        }).catch(() => {
	            // TODO: global error state for reporting to user
	        });
        } else {
	        API.post(`/notes/${note_obj.id}`, {
	        	id: note_obj.id,
	            data: note_obj.data,
	            iv: note_obj.iv
	        }).then((noteJSON) => {
	            var note = {
	                id: noteJSON.id,
	                iv: noteJSON.iv,
	                data: decrypt_note(noteJSON, user_key),
	                decrypted: true
	            }
	            commit('add_note', { note });
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