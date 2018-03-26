import API from '../api/api.js';
export class UserAuth {

	static create_user(username, password) {
		var user = {}
		// Username
		user.username = username; //"person";

		// Password
		user.password = password; //"password1234";

		// salt
		user.salt = AuthUtil.cryptrand(64); //asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes('7df260f33467dd4e'));//cryptrand(64);

		// client private key
		user.private_key = AuthUtil.H(user.salt, user.username, user.password);

		// verifier
		user.verifier = AuthUtil.N.power(AuthUtil.g, user.private_key);

		// client private
		user.private_ephemeral = AuthUtil.cryptrand();

		// client public ephemeral
		user.public_ephemeral = AuthUtil.N.power(AuthUtil.g, user.private_ephemeral);
		return API.post('/signup', {
			"username": user.username.toString(),
			"verifier": user.verifier.toString(),
			"salt": user.salt.toString()
		});
	}

	login(username, password) {
		// Username
		this.username = username;

		// Password
		this.password = password;
		console.log(username, password)

		// client private
		this.private_ephemeral = AuthUtil.cryptrand(1024);

		// client public ephemeral
		this.public_ephemeral = AuthUtil.N.power(AuthUtil.g, this.private_ephemeral);
		return API.post('/authentication', {
			"username": this.username,
			"client_ephemeral": this.public_ephemeral.toString()
		});
	}

	send_proof(salt, server_ephemeral, auth_session) {
		/*if(['private_key','verifier','username','password'].find((key) => !this.hasOwnProperty(key))){
			console.error("Run login before send proof");
			return;
		}*/
		this.salt = asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes(salt));
		this.auth_session = auth_session;
		var B = asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes(server_ephemeral));
		// private key
		this.private_key = AuthUtil.H(this.salt, this.username, this.password);
		// verifier
		this.verifier = AuthUtil.N.power(AuthUtil.g, this.private_key);
		var u = AuthUtil.H(this.public_ephemeral, B);
		if (!u.compare(asmCrypto.BigNumber.fromNumber(0))){
			console.log('u == 0?', u);
		} else {
			console.log(u.toString());
		}
		// client session key
		var S_cL = B.subtract(AuthUtil.k.multiply(this.verifier)),
			S_cR = this.private_ephemeral.add(u.multiply(this.private_key));

		// Our bigNumber library does not operate properly with negative numbers
		// so we flip the base to postive as -x^y == x^y
		S_cL.sign = 1;
		// This is where the issue is. S_cL and S_cR are correct, but not power
		var S_c = AuthUtil.N.power(S_cL, S_cR)
		// client shared key
		this.shared_key = AuthUtil.H(S_c);
		// client proof
		this.client_proof = AuthUtil.generate_proof(this.username, this.salt, this.public_ephemeral, B, this.shared_key)
		return API.post("/verify-auth", {
			"client_proof": this.client_proof.toString(),
			"auth_session": this.auth_session
		});
	}

	check_proof(server_proof){
		var to_check = AuthUtil.H(this.public_ephemeral,this.client_proof,this.shared_key).toString();
		console.log(to_check, server_proof);
		if(to_check == server_proof){
			this.authenticated = true;
		} else {
			this.authenticated = false;
		}
		return this.authenticated;
	}
}

const AuthUtil = {
	N: new asmCrypto.Modulus(asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes("c037c37588b4329887e61c2da3324b1ba4b81a63f9748fed2d8a410c2fc21b1232f0d3bfa024276cfd88448197aae486a63bfca7b8bf7754dfb327c7201f6fd17fd7fd74158bd31ce772c9f5f8ab584548a99a759b5a2c0532162b7b6218e8f142bce2c30d7784689a483e095e701618437913a8c39c3dd0d4ca3c500b885fe3") ) ),
	g: asmCrypto.BigNumber.fromNumber(2),
	// H(N,g)
	k: new asmCrypto.Modulus(asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes("d24e2e1d1500ea44d19052db8e1398d0052e09392e0798faaa78ca229bf4a390") ) ),
	bn_xor(bn1, bn2) {
		var bytes1 = bn1.toBytes(),
			bytes2 = bn2.toBytes(),
			buf0 = bytes1.length - bytes2.length,
			bigger = buf0 > 0 ? bytes1 : bytes2,
			values = new Uint8Array(bigger.length);

		for (var idx = 0; idx <= bigger.length; idx++) {
			if (idx < buf0) {
				values[idx] = bigger[idx]
			} else {
				values[idx] = bytes1[idx] ^ bytes2[idx];
			}
		}
		return asmCrypto.BigNumber.fromArrayBuffer(values);
	},
	H() {
		let full_text = [...arguments].map((n) => n.toString()).join(':');
		return asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.SHA256.bytes(asmCrypto.string_to_bytes(full_text)));
	},
	cryptrand(n = 1024) {
		return asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.getRandomValues(new Uint8Array(n / 8)));
	},
	hex_to_bn(hex) {
		return asmCrypto.BigNumber.fromArrayBuffer(asmCrypto.hex_to_bytes(hex));
	},
	generate_proof(username, salt, public_ephemeral, B, shared_key) {
		return this.H(
			this.bn_xor(this.H(this.N), this.H(this.g)),
			this.H(username),
			salt,
			public_ephemeral,
			B,
			shared_key);
	}
}

export default UserAuth;