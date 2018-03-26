import json
from server import app, c, conn
from utils import make_response, login_required, cryptrand
from flask import request, g

@app.route('/notes/<note_id>', methods=['POST','GET'])
@login_required
def message_route(note_id):
	c.execute("SELECT note_id FROM notes WHERE user_id=? AND note_id=?", (g.user_id, note_id))
	if len(c.fetchall()) < 1:
		return BAD_AUTH_RESPONSE
	if request.method == 'GET':
		c.execute("SELECT data FROM notes WHERE user_id=? AND note_id=?", (g.user_id, note_id))
		row = c.fetchone()

		return make_response(row)
	elif request.method == 'POST':
		js = json.loads(request.data)
		c.execute("UPDATE notes SET data=? WHERE note_id=? AND user_id=?", (js['data'], note_id, g.user_id))
	return

@app.route('/notes', methods=['PUT','GET'])
@login_required
def messages_route():
	if request.method == 'GET':
		c.execute("SELECT note_id, data FROM notes WHERE user_id=?",(g.user_id))
	elif request.method == 'PUT':
		
		note_id = cryptrand(64)
		c.execute("INSERT INTO notes (user_id, data, note_id) VALUES (?, ?, ?)", (g.user_id, request.data, note_id))

		return make_response(request.data, status=200)
	return