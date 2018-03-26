from server import app, c, conn
from utils import make_response, login_required, cryptrand, hex_to_int, int_to_hex, H, params
from flask import request
import json
import hashlib
import random

auth_sessions = {}

@app.route('/authentication', methods=['POST', 'DELETE'])
def auth():
	global c, conn
	if request.method == 'POST':
		js = json.loads(request.data)
		I = js['username']
		
		c.execute("SELECT rowid, salt, verifier FROM users WHERE username=?", (I,))
		user_rows = c.fetchall()
		if len(user_rows) <= 0:
			error = { 'error': 'Authentication Failed' }
			return make_response(json.dumps(error), status=400);
		user_id = user_rows[0][0]
		s = user_rows[0][1]
		v = hex_to_int(user_rows[0][2])
		

		A = hex_to_int(js['client_ephemeral'])
		
		b = cryptrand(1024)
		B = (params['k'] * v + pow(params['g'], b, params['N'])) % params['N']

		auth_session_key = int_to_hex(cryptrand(64));

		auth_sessions[auth_session_key] = {
			'I': I,
			'A': A,
			's': s,
			'v': v,
			'b': b,
			'B': B,
			'user_id': user_id
		}

		data = {
			"salt": s,
			"server_ephemeral": int_to_hex(B),
			"auth_session": auth_session_key
		};
		return make_response(json.dumps(data))
	elif request.method == 'DELETE':
		resp = make_response('{}')
		for k, v in request.cookies.iteritems():
			if 'AUTH-' in k:
				resp.set_cookie(k,'',expires=0)
		return resp

@app.route('/verify-auth', methods=['POST'])
def auth_verify():
	global c, conn
	js = json.loads(request.data)
	#I = js['I']
	auth_session_key = js['auth_session']
	
	I = auth_sessions[auth_session_key]['I']
	A = auth_sessions[auth_session_key]['A']
	v = auth_sessions[auth_session_key]['v']
	B = auth_sessions[auth_session_key]['B']
	b = auth_sessions[auth_session_key]['b']
	s = auth_sessions[auth_session_key]['s']

	user_id = auth_sessions[auth_session_key]['user_id']

	#M_c = hex_to_int(js['M_c'])
	M_c = hex_to_int(js['client_proof'])
	u = H(A, B)
	S_s = pow(A * pow(v, u, params['N']), b, params['N'])
	K_s = H(S_s)
	M_s = H(A, M_c, K_s)
	

	UID = int_to_hex(H(user_id, s))
	session_token = int_to_hex(cryptrand(512))
	data = {
		"server_proof": int_to_hex(M_s),
		"UID": UID,
		"session_token": session_token
	}

	# remove all old sessions
	resp = make_response(json.dumps(data))
	for key,v in request.cookies.iteritems():
		if 'AUTH-' in key:
			old_uid = key.replace("AUTH-",'')
			c.execute("DELETE FROM sessions WHERE UID=?",(old_uid,))
			resp.set_cookie(key,'',expires=0)

	c.execute("INSERT INTO sessions (session_token, user_id, UID) VALUES (?, ?, ?)", (session_token, user_id, UID))
	conn.commit()
	
	resp.set_cookie('AUTH-' + UID, json.dumps({
			"session_token": session_token,
			"UID": UID
		}))
	return resp