import json
from server import app, c, conn
from utils import make_response, login_required, cryptrand, int_to_hex, hex_to_int, BAD_AUTH_RESPONSE
from flask import request, g

@app.route('/notes/<note_id>', methods=['POST','GET'])
@login_required
def message_route(note_id):
	c.execute("SELECT id FROM notes WHERE user_id=? AND id=?", (g.user_id, note_id))
	if len(c.fetchall()) < 1:
		return BAD_AUTH_RESPONSE
	if request.method == 'GET':
		c.execute("SELECT data, iv FROM notes WHERE user_id=? AND id=?", (g.user_id, note_id))
		row = c.fetchone()
		note = {
			'data': row[0],
			'iv': row[1],
			'id': note_id
		}
		return make_response(json.dumps(note))
	elif request.method == 'POST':
		js = json.loads(request.data)
		c.execute("UPDATE notes SET data=?, iv=? WHERE id=? AND user_id=?", (js['data'], js['iv'], note_id, g.user_id))
		return make_response()
	return

@app.route('/notes', methods=['PUT','GET'])
@login_required
def messages_route():
	if request.method == 'GET':
		c.execute("SELECT id, data, iv FROM notes WHERE user_id=?",(g.user_id,))
		notes = []
		for row in c.fetchall():
			notes.append({
				'id': row[0],
				'data': row[1],
				'iv': row[2]
				})
		# TODO: Paginate
		return make_response(json.dumps(notes))
	elif request.method == 'PUT':
		js = json.loads(request.data)
		note_id =  int_to_hex(cryptrand(64))

		c.execute("INSERT INTO notes (user_id, data, iv, id) VALUES (?, ?, ?, ?)", (g.user_id, js['data'], js['iv'], note_id))
		data = {
			'id': note_id,
			'data': js['data'],
			'iv': js['iv']
		}
		return make_response(json.dumps(data), status=200)
	return