from flask import Flask, request, Response, g
from functools import wraps
import hashlib
import random

def make_response(response='{ "status": 200 }', status=200, mimetype="application/json", download=False, headers={}):
	resp = Response(response=response, status=status, mimetype=mimetype)
	resp.headers['Access-Control-Allow-Origin'] = '*'
	for key, val in headers.iteritems():
		resp.headers[key] = val
	if download:
		resp.headers['Content-Disposition'] = 'attachment; filename="export.csv"'
	return resp

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.authenticated == False:
            return BAD_AUTH_RESPONSE
        return f(*args, **kwargs)
    return decorated_function


# TODO: rename hash function to something reasonable
def H(*args):
	all_args = []
	for b in args:
		if isinstance(b,int) or isinstance(b,long):
			all_args.append(int_to_hex(b))
		else:
			all_args.append(str(b))
	a = ':'.join(all_args)
	# print '\n',all_args,'\n'
	return int(hashlib.sha256(a).hexdigest(), 16)

def cryptrand(n=1024):
	global params
	return random.SystemRandom().getrandbits(n) % params['N']

def hex_to_int(data):
	return int(''.join(data.split()).replace(' ',''),16)

def int_to_hex(data):
	return hex(data)[2:].replace('L','')

params = {}
params['N'] = hex_to_int('''00c037c37588b4329887e61c2da3324b1ba4b81a63f9748fed2d8a410c2fc21b1232f0d3bfa024276cfd88448197aae486a63bfca7b8bf7754dfb327c7201f6fd17fd7fd74158bd31ce772c9f5f8ab584548a99a759b5a2c0532162b7b6218e8f142bce2c30d7784689a483e095e701618437913a8c39c3dd0d4ca3c500b885fe3''')

params['g'] = 2
params['k'] = H(params['N'],params['g'])


BAD_AUTH_RESPONSE = make_response('{ "error": "Page not found" }', status=404)