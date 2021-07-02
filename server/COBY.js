var web = require("ws"),
    spawn = require("child_process").spawn,
	fs = require("fs"),
    cobaseClient,
    babel = tryquire("@babel/core"),
    vm = require("vm"),
	http = require("http"),
	https = require("https"),
	protocols = {
		"http:": http,
		"https:": https
	},
	cobase = coquire("./cobase.js"),
	adan = coquire("./adan.js"),
	PNG = require("pngjs").PNG,
	stream = require("stream"),
	URL = require("url"),
    fetch = null,
    empty = ((w,c)  => {}),
    ctxTemplate = {
        document: {
            body: {
                appendChild:empty,
                addEventListener:empty
            },
            head: {
    
            },
            getElementsByTagName:empty,
            getElementById:empty,
            querySelector:empty,
            querySelectorAll:empty,
            createElement:empty,
            createElementNS:empty,
            styleSheets:[],
            addEventListener:empty
        }
    },
	sheets,
    self = {

    },
	premadeFuncs = {
		
	}
	
self.tzurah = function(buffer, cb) {
	if(t(buffer, Buffer)) {
		
		var ar = new Uint8Array(buffer),
			lng = Math.ceil(ar.length / 4);
			if(lng < 1) lng = 10;
			p = new PNG({
				width: lng,
				height: 1
			});
		p.data[0] = 2;
		for(var i = 0; i < ar.length; i++) {
			p.data[i] = ar[i];
		}
		sbuff(p.pack(), b => {
			if(t(cb, Function)) {
				cb(b);
			}
		});
		
	}
};

self.chomer = function(imgB, cb) {
	if(t(imgB, Buffer)) {
		var bf = Buffer.from(imgB);
		b2s(bf)
		.pipe(new PNG({
			
		}))
		.on("parsed", function() {
			var count = 0;
			for(var i = this.data.length - 5; i < this.data.length; i++) {
				if(this.data[i] == 0) {
					count++;
					
				}
			}
			var nb = Buffer.alloc(this.data.length - count);
			for(var i = 0; i < nb.length; i++) {
				nb[i] = this.data[i]
			}
			var buft = nb;
			cb(buft);
			
			console.log(nb, "hi", nb[0] == 0, nb[0], count);
		});
	}
}

self.url = function(str) {
	var rez = {};
	rez.parts = str.split("/").filter(x=>x);
	return rez;
}
self.gudalify = function(buffer, wdt, calb) {
	
	cobRes(buffer, wdt, calb);
	function cobRes(iBuf, width, cb) {
		b2s(iBuf)
		.pipe(new PNG({
			filterType: -1
		}))
		.on('parsed', function() {
			
			var nw = width;
			var nh = nw *  this.height /this.width;
			var f = resize(this, nw, nh);
			
			sbuff(f.pack(), b=>{
				console.log(b);
				cb(b);
			})
		})
		
		
		function resize(srcPng, width, height) {
			var rez = new PNG({
				width:width,
				height:height
			});
			for(var i = 0; i < width; i++) {
				var tx = i / width,
					ssx = Math.floor(tx * srcPng.width);
				for(var j = 0; j < height; j++) {
					var ty = j / height,
						ssy = Math.floor(ty * srcPng.height);
					var indexO = (ssx + srcPng.width * ssy) * 4,
						indexC = (i + width * j) * 4,
						rgbaO = [
							srcPng.data[indexO  ],
							srcPng.data[indexO+1],
							srcPng.data[indexO+2],
							srcPng.data[indexO+3]
						]
					rez.data[indexC  ] = rgbaO[0];
					rez.data[indexC+1] = rgbaO[1];
					rez.data[indexC+2] = rgbaO[2];
					rez.data[indexC+3] = rgbaO[3];
				}
			}
			return rez;
		}
		
		
	}
};

self.json = val => {
		var j;
		try {
			j = JSON.parse(val);
			return j;
		} catch(e) {
			console.log(e);
			return val;
		}
}

self.getPost = function(q, cb) {
	var bufz = [];
	var s = "";
		
	q.on("data", d=> {
		//s += d.toString();
		bufz.push(d);
	});
	q.on("end", () => {
		var buft = Buffer.concat(bufz);
		t(cb, Function) && cb({
			result: buft,
			headers: Object.fromEntries(Object.entries(q.headers).map(ent => 
					[
						ent[0], 
						self.json(ent[1])
					]
			))
		}
			
			//.toString()
		);
	});
};

self.bavel = new function() {
	if(babel) {
		this.transform = (code, onerr = empty) => {
			if(babel != null) {
				try {
				return babel.transform(code, {
					presets: ["@babel/preset-env"]
					}).code.replace(`"use strict";`, "");
				} catch(e) {
					onerr(e);
					return null;
				}
			
			} else {
				onerr("YO didn't find that babel installed at all");
				return null;
			}
		};
	}
    
};
function b2s(b) {
	var str = new stream.Readable();
	str.push(b);
	str.push(null);
	return str;
}
function sbuff(stream, cb) {
	var bufs = []
	var pk = stream;
	pk.on('data', (d)=> {
		bufs.push(d);
		
	})
	pk.on('end', () => {
		var buff = Buffer.concat(bufs);
		cb(buff);
	});
}
	
function globalize(from, to) {
	
	for(var i in from) {
		to[i] = from[i];
	}
	//console.log("From", from, "to",to)
}

//console.log("HI",cobase)
function tryquire(mod) {
	var r;
	try {
		r = require(mod);
	} catch(e) {
		
	}
	return r;
}
function coquire(module) {
	
	var reqt = require(module);
	if(
		reqt && 
		t(reqt.go, Function)
	) {
		reqt.go({
			thing: globalize,
			transfer:  {
				hiThere: 5,
				cobase: cobase,
				adan: adan,
				web: web,
				empty: empty,
				t: t,
				http:http,
				https:https,
				fs:fs
			}
			
		});
	}
	return reqt;
}
var mqinStr = "wertyuiopqasdfghjklzxcvbnmMNBVXZKLKJHGFDSAOIUYTREWQ1234567890"

function mapAt(str) {
	var rez=""
	str = str.toString()
	str.split("").forEach(x => {
		rez += mqinStr[
			x.charCodeAt(0) % 
			mqinStr
			.length
		]
	})
	return rez;
}
self.mapAt = mapAt
defineObjectProperties();
self.tafkids = premadeFuncs;
self.writeFile = (name, binary, cb) => {
	fs.writeFileSync(name, binary);
	if(t(cb, Function)) {
		cb();
	}
};
self.readFile = (url, cb) => {
	fs.readFile(url, cb);
};
self.bavel = new function() {
    this.transform = (code, onerr = empty) => {
        if(babel != null) {
            try {
            return babel.transform(code, {
                presets: ["@babel/preset-env"]
                }).code.replace(`"use strict";`, "");
            } catch(e) {
                onerr(e);
                return null;
            }
        
        } else {
            onerr("YO didn't find that babel installed at all");
            return null;
        }
    };
    
};
/*

	var s = url.split("/"),	
		host,
		path,
		ind;
	if(url.includes("http"))
		ind = 2
	else if(s[0].includes("www"))
		ind = 0;
	if(ind) {
		host = s[ind];
	}
		
	path = url.split(host)[1];
	
	.split(":").join("")
*/
self.globalize = globalize;
self.stringify = obj => {
	try {
		return JSON.stringify(obj);
	} catch(e) {
		console.log(e);
		return obj
	}
};
self.bakasha = opts => {
	if(!opts) opts = {};
	if(!opts.type) opts.type="";
	var url = opts.url || "",
		parsed = URL.parse(url)
		cb = opts.cb || opts.callback,
		
		binary = opts.type == "binary",
		proto = protocols[
			(parsed.protocol || "")
		],
		port = opts.port || parsed.port || 80,
		path = opts.pathname || parsed.pathname,
		host = opts.host || parsed.host,
		headers = opts.headers || {}/*Object.fromEntries(Object.entries(opts.headers || {}).map(ent =>
			(
				[
					ent[0],
					self.stringify(ent[1])cmd
				]
			))
		)*/,
		body = opts.body || "",
		method = opts.method || "GET";
	if(proto && proto.request) {
		var reqt = proto.request(url,{
			/*host:host,
			path:path,
			port: port,*/
			method: method,
			headers
		}, r => {
			if(binary) {
				r.setEncoding("binary");
			}
			var chnkz = binary ? [] : "";
			r.on("data", chunk => {
				binary ? chnkz.push(
					Buffer.from(chunk, "binary")
				) : chnkz += chunk
			});
			r.on("end", () => {
				if(cb) cb(
					binary ? Buffer.concat(chnkz) :
					chnkz
				);
			});
		});
		if(method.toLowerCase() == "post") {
			reqt.write(body);
			
		}
		reqt.end();
	}
};
self.get = (url, opts) => { 
	if(!opts) opts = {};
    return new Promise((r, rj) => {
		self.bakasha({
			url: url,
			...opts,
			callback: (data) => {
				r(data)
			}
		})
	})/*fetch ? (new Promise((r,rr) => {
        fetch(url, opts).then(b=>b.text()).then((b,e) => {
            if(e) rr(e);
            r(b);
        })) : "";
		
    });*/
};

self.import = async (url, myG = null) => {
    return new Promise((r,rr) => {
        self.get(url).then((c) => {
            var ctx = ctxTemplate;

            vm.runInNewContext(
                c, 
                ctx
            );
            if(myG !== null) {
                self.globalize(ctx, myG);
            }         
            r(ctx);  
        });
    });
}


self.cobase = cobase;

self.cmd = (commandString, opts) => {
    if(!opts) {
        opts = {};
    }
    if(commandString && commandString.constructor == String) {
        var arrayified = splitCommandString(commandString);
        var first = arrayified.shift();
   
        try {
            var malach = spawn(first, arrayified);
            malach.stderr.on("data", (data) => {
                (opts.onData || empty)(data.toString());
            });
            malach.stdout.on("error", (err) => {
                (opts.onError || empty)(err.toString());
            });

            malach.on("exit", (ec) => {
                (opts.onExit || empty)("just finished with code: " + ec);
            });
        } catch(e) {
            (opts.onFail || empty)({
                message:"failed with this command string: " + commandString + "and this is the first argument" + first + "and this is the rest" + JSON.stringify(arrayified),
                failure:e
            });
        }

    }

};


self.adanServer = (opts) => {
    if(adan) {
		new adan.AdanServer(opts);
	}
};

module.exports = self;

function stringOrJSON(test) {
    var result;
    try {
        result = JSON.stringify(test);
    } catch(e) {
        if(test && test.constructor == String) {
            result = test;
        } else {
            result = test.toString();
        }
    }
    return result;
}

function isObject(thing) {
    return thing && thing.constructor == Object;
}

function JSONorString(test) {
    var result = {"nothing":"not a JSON or a string!"};
    if(test && test.constructor == Object) {
        result = test;
    } else {
        result = test.toString("utf-8");
    }
    try {
        result = JSON.parse(test);
    } catch(e) {
        
    }
    return result;
}

function splitCommandString(str) {
    return (str.match(/\\?.|^$/g).reduce((p, c) => {
        if(c === '"' || c === "'"){
            if(!(p.quote ^= 1)){p.a.push('');} 
        }else if(!p.quote && c === ' ' && p.a[p.a.length-1] !== ''){ 
            p.a.push('');
        }else{
            p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
        }
        return  p;
    }, {a: ['']}).a).map(x => x.trim());
}

function addToObj(base, addition) {
    return Object.fromEntries(
                Object.entries(base)
                .concat(
                    Object.entries(
                        addition
                    )
                )
            )
}

function t(val, cons) {
    return (
        (
            val || 
            val == 0 ||
            val == false ||
            val == ""
        ) ? 
            cons ?
                val.constructor == cons
            :
                val.constructor
        :
            false
    );
}

function defineObjectProperties() {
    Object.defineProperties(Object.prototype, {
        values: {
            value() {
                var result = [];
                for(var k in this) {
                    result.push(this[k]);
                }
                return result;
            }
        },
        entries: {
            value() {
                var result = [];
                for(var k in this) {
                    result.push([
                        k,
                        this[k]
                    ]);
                }
                return result;
            }
        }
        
    });
    Object.defineProperties(Object, {
        fromEntries: {
            value(input) {
                var result = {};
                input.forEach(x => {
                    result[x[0]] = x[1];
                });
                return result;
            }
        },
		
        values: {
            value(obj) {
                var result = [];
                for(var k in obj) {
                    result.push(obj[k]);
                }
                return result;
            }
        },
        entries: {
            value(obj) {
                var result = [];
                for(var k in obj) {
                    result.push([
                        k,
                        obj[k]
                    ]);
                }
                return result;
            }
        }
    });
}

function copyObj(obj) {
		var result = {};
		if(obj) {
			if(t(obj, Object)) {
				for(var k in obj) {
					result[k] = obj[k]
				}
			} else if(t(obj, Array) || obj.hasOwnProperty("length")) {
				result = [];
				for(var i = 0; i < obj.length; i++) result.push(obj[i])
			} else {
				result = obj;
			}
		}
		return result;
}

function includePossibleScripts() {
    try {
        babel = require("@babel/core");
    } catch(E) {
        console.log(E);
    }
}






if(global.cobyAuth) {
				var tok = global.cobyAuth;
				var what = parts[0],
      id = parts[1],
				      headers = "a",//tj(parts[2]),
				      body = "a"//tj(parts[3]);
				var api = "https://docs.googleapis.com/v1/documents/{documentId}"
				if(
what == "docify" &&
id && headers && 
body
) {
	https.get(api.replace("{documentId}", id), {
		method: "GET",
		headers: {
			Authorization: " Bearer " + tok,
		}
	}).then(a=> {
		var s = "";
a.on("data", d => {
		r.write(d.toString());
		s += d.toString();
});
a.on("end", d=> {
	r.end(s);
})
})
}
			}

