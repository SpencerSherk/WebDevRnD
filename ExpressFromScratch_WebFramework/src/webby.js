
const net = require('net');
const fs = require('fs');
const path = require('path');


class Request {

  	constructor(s) {

    	const [method, path, ...notUsed] = s.split(' ');
    	this.method = method;
    	this.path = path;
  	}
}

// Begin response class

class Response {

	constructor(socket, statusCode, version) { 
		if (statusCode == undefined) {
			this.statusCode = 200;
		} else {
			this.statusCode = statusCode;
		}
		if (version == undefined) {
			this.version = "HTTP/1.1";
		} else {
			this.version = version;
		}
		this.sock = socket;
		this.headers = {};
		this.body = "";
	}

	set(name, value) {
  		this.headers[name] = value;
  	}

  	end() { 

  		this.sock.end();
  	}

  	statusLineToString() {

  		return (this.version + " " + this.statusCode + " " + HTTP_STATUS_CODES[this.statusCode] + "\r\n")
  	}


	headersToString() {

		let str = '';
		let count = 0;
		const names = Object.keys(this.headers);
		for (let header in this.headers) {
			str += names[count] + ": " + this.headers[names[count]] + "\r\n"; 
			count++;
		}
		return str;
	}

	send(body) {

		this.body = body;
    if (this.headers["Content-Type"] == null)
		  this.headers["Content-Type"] = "text/html";
		this.sock.write(this.statusLineToString());
		this.sock.write(this.headersToString() + "\r\n");
    //this.sock.write(this.headersToString());
		this.sock.write(this.body);
		this.end();
	}

	 status(statusCode) {

	 	this.statusCode = statusCode;
	 	return this;
	 }
}

// end Response Class


// Begin App Class

class App {

	constructor() {

		this.server = net.createServer(sock => this.handleConnection(sock)); // HERE
		this.routes = {};
		this.middleware = null;
	}

	normalizePath(path) {
    	let str = "";
    	let count = 0;
    	var regex = /[A-z]/g;
    	while ( path.charAt(count).match(regex) || path.charAt(count) == "/") {
    		if (path.charAt(count) == "/"){
    			str += "/";
    		} else {
    			str += path.charAt(count).toLowerCase();
    		}
    		count++;
    	}

    	// remove trailing slash
    	if (str.charAt(str.length-1) == "/")
    		str = str.slice(0, -1);
    	return str;
    }

    createRouteKey(method, path) {

    	method = method.toUpperCase();
    	path = this.normalizePath(path);
    	return (method + " " + path);
    }

    get(path, cb) {

    	const key = this.createRouteKey("GET", path);
    	this.routes[key] = cb;
    }

    use(cb) {

    	this.middleware = cb;
    }

    listen(port, host) {

    	this.port = port;
    	this.host = host;
    	this.server.listen(port, host);
    }

    handleConnection(sock) { 

      sock.on('data', (data) => {
        this.handleRequest(sock,data);     // ---- 3 !!!!   ------- 3 !!!!!
      });

    }

    handleRequest(sock, binaryData) {

    	let str = "";
  		str = binaryData.toString('utf8');
  		const req = new Request(str);
    	const res = new Response(sock);
    	if (this.middleware != null) {
    		this.middleware(req, res, () => {    // Is this ok? / a real callback
    			this.processRoutes(req,res);
    			}) 
    	} else {
        console.log("here");
    		this.processRoutes(req,res);
    	}
    }

    processRoutes(req, res) {

    	this.req = req;
    	this.res = res;
    	let key = this.createRouteKey(req.method, this.normalizePath(req.path));
      console.log("key:  " + key);
      console.log(this.routes);

    	if (this.routes.hasOwnProperty(key)) {
    		this.routes[key](req, res);
        console.log("success");
    	} else { 
    		//console.log("404 my dude!"); 
        // commented out bc of annoying false triggers
    	}
    }
}


// end APP class

const [PORT, HOSTNAME] = [3000, '127.0.0.1'];

const HTTP_RESP_DESC = {
  200: 'OK',
  404: 'NOT FOUND',
  500: 'SERVER ERROR'
};

function makeResponse(status, contentType, body) {

  let response = `HTTP/1.1 ${status} ${HTTP_RESP_DESC[status]}\r\n`;
  response += `Content-Type: ${contentType}\r\n\r\n`;
  response += body;
  return response;
}

function handleRead(sock, err, data) {
  // read already happened  
  if(err) {
    sock.write(makeResponse(500, 'text/html', data));
  } else {
    sock.write(makeResponse(200, 'text/html', data));
    sock.end();
  }
}

function handleConnect(sock) {

  console.log(sock.remoteAddress, 'connected!');
  sock.on('data', (binaryData) => {
    const s = binaryData + '';
    const req = new Request(s);
  });
}

const HTTP_STATUS_CODES = {
  200: 'OK',
  404: 'Not Found',
  500: 'Internal Server Error'
};

const  MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  html: 'text/html',
  css: 'text/css',
  txt: 'text/plain'
}

// helper functions

function getExtension(fileName) {

	if (fileName.includes('.')){
		const words = fileName.split('.');
		return (words[words.length-1].toLowerCase());
	} else {
		return "";
	}
}

function getMIMEType(fileName) {

	switch(getExtension(fileName)) {
	    case "jpeg":
	        return "image/jpeg";
	        break;
	    case "jpg":
	        return "image/jpeg";
	        break;
	    case "png":
	        return "image/png";
	        break;
	    case "txt":
	        return "text/plain";
	        break;
	    case "html":
	        return "text/html";
	        break;
	    case "css":
	        return "text/css";
	        break;
	    case "":
	        return "";
	        break;
	    default:
	        return "invalid MIMEtype";
	}
}

function serveStatic(basePath) {

	return ((req, res, next) => {
		let newPath = path.join(basePath, req.path); 
		fs.readFile(newPath, function read(err, data) {
    		if (err) {
    			next(req, res);
          //console.log("static - err");
          // commented out bc of annoying false triggers
    	} else {
        let ext = getExtension(newPath);
        res.set('Content-Type', MIME_TYPES[ext]);
  	    this.content = data;
        res.send(this.content);
        res.end();
      }
    });
	});
}

const server = net.createServer(handleConnect);
console.log('we are in ', __dirname);
server.listen(PORT, HOSTNAME);

module.exports = {
    HTTP_STATUS_CODES: HTTP_STATUS_CODES,
    MIME_TYPES: MIME_TYPES,
    getExtension: getExtension,
    getMIMEType: getMIMEType,
    App: App,
    Request: Request,
    Response: Response,
    static: serveStatic
}
