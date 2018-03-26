import API from '@/api/api.js';

export const state = {
	all: []
};

export const getters = {
	all: (state) => state.all,
	by_id: (state) => (id) => {
		return state.all.find((note) => note.note_id == id);
	}
};

export const mutations = {
	set_notes(state, { notes }){
		state.all = notes;
	},
	add_note(state, { note }){
		state.all.push(note);
	},
	update_note(state, {note}){
		var note_idx = state.all.find((note) => note.note_id == id);
		state.all[note_idx] = note;
	}
};

export const actions = {
	get_all({ commit, rootGetters }){
		var user_key = rootGetters['user/_private_key'];
		API.get('/notes').then((notes)=>{
			notes.forEach((note)=>{
				note.data = asmCrypto.bytes_to_string( asmCrypto.AES_CBC.decrypt(asmCrypto.hex_to_bytes(note.data), user_key.toBytes()) );
				note.decrypted = true;
				commit('update_note',note);
			});
		}).catch(()=> {
			commit('set_notes',{notes:[]});
		});
	},
	add_note({ commit, rootGetters }, note_obj){
		var user_key = rootGetters['user/_private_key'];
		console.log(note_obj);
		if(note_obj.decrypted){
			note_obj.data = asmCrypto.bytes_to_hex( asmCrypto.AES_CBC.encrypt(asmCrypto.string_to_bytes(note_obj.data), user_key.toBytes()) );
			note_obj.decrypted = false;
		}
		console.log(note_obj.data);
		API.put('/notes', note_obj.data)
			.then((noteData) => {
				var note = {
					data: asmCrypto.bytes_to_string( asmCrypto.AES_CBC.decrypt(asmCrypto.hex_to_bytes(noteData), user_key.toBytes()) ),
					decrypted: true
				}
				commit('add_note', { note });
			}).catch(()=>{
				// TODO: global error state for reporting to user
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