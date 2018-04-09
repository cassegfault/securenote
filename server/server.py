import hashlib
import random
import json
import os
import sqlite3
conn = sqlite3.connect('securenote.db')
c = conn.cursor()

from flask import Flask, request, Response, g
from flask_cors import CORS, cross_origin
from utils import login_required, make_response
app = Flask(__name__)
cors = CORS(app)


#setup for reference
c.execute(''' CREATE TABLE IF NOT EXISTS `users` (username text, salt text, verifier text) ''')
c.execute(''' CREATE TABLE IF NOT EXISTS `notes` (id text, user_id int, data text, iv text)''')
c.execute(''' CREATE TABLE IF NOT EXISTS `sessions` (user_id int, UID int, session_token text) ''')
conn.commit()

@app.before_request
def before_request():
	global c, conn
	authenticated = False
	user_id = None
	auth_json = None
	if 'Authentication' in request.headers:
		auth_json = json.loads(request.headers.get('Authentication'))
	for cookie,v in request.cookies.iteritems():
		if 'AUTH-' in cookie:
			auth_json = json.loads(v)
			break
	if auth_json is not None:
		if 'session_token' in auth_json and 'UID' in auth_json:
			c.execute("SELECT user_id FROM sessions WHERE session_token=? AND UID=?", (auth_json['session_token'], auth_json['UID']))
			auth_rows = c.fetchall()
			if len(auth_rows) > 0:
				user_id = auth_rows[0][0]
				authenticated = True

	g.user_id = user_id
	g.authenticated = authenticated


headers = {
	'Access-Control-Allow-Origin':'*',
	'Cache-Control': 'no-cache, no-store, must-revalidate',
	'Pragma': 'no-cache',
	'Expires': '0'
}

@app.route('/signup', methods=['POST'])
def signup():
	global c, conn
	js = json.loads(request.data)
	uname = js['username']
	salt = js['salt']
	verifier = js['verifier']
	#users[uname] = {
	#	'v': verifier,
	#	's': salt,
	#}

	c.execute("INSERT INTO users (username, verifier, salt) VALUES (?, ?, ?)", (uname, verifier, salt))
	conn.commit()

	return make_response("{}", headers=headers)

@app.route('/info', methods=['GET'])
@login_required
def get_info():
	return make_response('{}',status=200)
	

from routes.auth import *
from routes.notes import *


if __name__ == '__main__':
	app.run()