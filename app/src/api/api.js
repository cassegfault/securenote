const API = {
    server_location: "https://securenote.v3x.pw/api",
    options_to_formdata(options) {
        if (typeof options === 'string') {
            return options;
        } else if (!options) {
            return "";
        }

        var out = "",
            keys = Object.keys(options);
        for (let k in keys) {
            out += `&${keys[k]}=${options[keys[k]]}`;
        }
        out = out.substring(1);
        return out;
    },

    get(endpoint, options) {
        return this.get_endpoint(endpoint, options);
    },
    put(endpoint, options) {
        return this.post_endpoint(endpoint, options, "PUT");
    },
    post(endpoint, options) {
        return this.post_endpoint(endpoint, options, "POST");
    },
    delete(endpoint, options) {
        return this.post_endpoint(endpoint, options, "DELETE");
    },

    get_endpoint(endpoint, options = {}) {
        const xhr = new XMLHttpRequest();
        var xhr_location = this.server_location + endpoint + '?' + API.options_to_formdata(options);
        var _promise = new Promise((resolve, reject) => {
            xhr.open("GET", xhr_location);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 0 || xhr.status === 502) {
                        /*if (!_promise.has_cancelled) {
                            reject(`No Connection To Server`);
                            console.error(this);
                        }*/
                        return;
                    }
                    var res_data = {};
                    try {
                        res_data = JSON.parse(xhr.response);
                    } catch (e) {
                    	console.error('JSON could not be parsed');
                        return;
                    }
                    if (xhr.status < 200 || xhr.status > 399) {
                        let errmsg = `Error ${xhr.status}: ${res_data.error}`;
                        reject(errmsg);
                    } else {
                        resolve(res_data);
                    }
                }
            }
            xhr.withCredentials = true;
            xhr.send();
        });
        //_promise.setCancel(() => { xhr.abort(); });
        return _promise;
    },

    post_endpoint(endpoint, options = {}, method = "POST") {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open(method, this.server_location + endpoint);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === xhr.DONE) {
                    /*if (xhr.status === 0 || xhr.status === 502) {
                        reject(`No Connection To Server`);
                        return;
                    }*/
                    var res_data = {};
                    try {
                        res_data = JSON.parse(xhr.response);
                    } catch (e) {
                        return;
                    }
                    if (xhr.status < 200 || xhr.status > 399) {
                        let errmsg = `Error ${xhr.status}: ${res_data.error}`;
                        reject(errmsg);
                    } else {
                        resolve(res_data);
                    }
                }
            }
            xhr.withCredentials = true;
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.send(JSON.stringify(options));
        });
    },
}

export default API;