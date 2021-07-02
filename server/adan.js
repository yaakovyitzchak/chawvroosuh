this.go = function(g) {
	g.thing(g.transfer,global);
	
}
let empty = () => {};

function AdanServer(opts) {
	
	
	if(!opts) {
        opts = {}
    }
	
	this.on = (str, func) => {
		if(!t(opts.adanFunctions, Object)) {
			opts.adanFunctions = {};
		}
		if(
			t(opts.adanFunctions, Object) &&
			t(str, String)
		) {
			if(opts.adanFunctions[str]) {
				let old = opts.adanFunctions[str];
				opts.adanFunctions[str] = function() {
					old(...arguments)
					func(...arguments);
				};
			} else {
				opts.adanFunctions[str] = func;
			}
		}
	};
	
	let db;
	if(t(opts.database, Object)) {
		db = new cobase.Database(
			opts.database,
			did => {
			//	console.log("DID it", did);
				this.on(did.command.name, did.command.func)
			}
		);
		
	}
	
	
	let oserver = opts.server;
	console.log("OK",t(oserver).name)
	
	let port = process.env.PORT || 
                    opts.port || 
                    this.port || 
                    80;
	if(t(oserver).name == "Server") {
		
		oserver.addListener("upgrade", function() {
//			console.log(arguments)
		});
		
	} else {
		oserver = http.createServer(t(oserver,Function) ? oserver : (q,r) => {
			r.end("welcome");
		});
	}
	oserver.listen(port);
    let wss = new web.Server(
		{server: oserver} || {
                port
                    
            }
        );
	wss.on("listening", () => {
		let func = opts["onlisten"] || opts["listening"] || opts["onlistening"] || opts["start"] || opts["onstart"];
		if(t(func, Function)) {
			func();
		}
	});
    wss.broadcast = (msg, opts2) => {
        if(!opts2) {
            opts2 = {};
        }

        wss.clients.forEach(x => {
            if((opts2.current && opts2.current !== x) || !opts2.current) {

				if(x.adan && x.readyState == web.OPEN) {

                    if(!opts.isBinary) {
                        x.adan.send(msg);
                    } else {
                        x.adan.sendBinary(msg);
                    }
                }
            }
        });
    };
    
    wss.on("connection", (ws) => {
   //     console.log("cobyconnection!");
        let cs = new CobyAdan(ws, wss);
		if(db) {
			cs.database = db;
		}
        cs.server = wss;
        ws.adan = cs;
        (opts["onOpen"] || empty)(wss,cs);
        ws.stillConnected = true;
        ws.on("pong", () => {
            ws.stillConnected = true;
        });

        cs.onMessage = (msg) => {
            (opts["onAdanMessage"] || opts["onMessage"] || empty)(msg,cs);
            let funcs = opts["adanFunctions"];
            if(funcs) {
                funcs = Object.fromEntries(
                            funcs.entries().map(x => [
                                x[0].toLowerCase(),
                                x[1]
                            ])
                        );
                if(isObject(msg)) {
                    for(let k in msg) {
                        if(funcs[k.toLowerCase()]) {
							try {
								funcs[k.toLowerCase()](msg[k],cs);
							} catch(e) {
								console.log("some weird error: ", e);
							}
                        }
                    }
                }
            }
        };
		
		let binaryFuncts = Object
							.entries(opts)
							.find(b => 
								(
									b[0].toLowerCase() == 
									"onbinarymessage" 									
								)
							);
							
		if(binaryFuncts) {
			cs.onBinaryMessage = msg => {
				binaryFuncts[1](msg, cs);
			}
		}

        cs.onClose = () => {
            (opts["onClose"] || empty)(cs);
        }
    });
    let intervalDefault = 1000,
        checkForDisconnectionsInterval = setInterval(() => {
        wss.clients.forEach(x => {
            if(!x.stillConnected) {
                x.adan = null;
                x.terminate();
            }
            x.stillConnected = false;
            x.ping(() => {});
        });
    }, ((opts["intervalLength"]) || intervalDefault));
    this.stopInterval = () => {
        if(checkForDisconnectionsInterval) {
            clearInterval(checkForDisconnectionsInterval);
            checkForDisconnectionsInterval = null;
        }
    };
}




function CobyAdan(ws, wss) {
    let adan = ws;
    if(adan && adan.send) {
        this.sendBinary = (msg) => {
            let mymsg = stringOrJSON(msg);
            let binary = null;
            try {
                binary = Buffer.from(mymsg);
            } catch(e) {

            }

            if(binary) {
                adan.send(binary);
            }
        };

        this.send = (msg) => {
            let mymsg = stringOrJSON(msg);
            adan.send(mymsg);
        };

        this.onMessage = (msg) => {

        };
		/*
		this.onBinaryMessage = msg => {
			
		};*/

        this.onClose = (ws) => {

        };
        
        this.getServer = () => {
            return wss;
        };

        ws.on("message", (msg) => {
            if(this.onMessage) {
               
                let str = JSONorString(msg);
              
                this.onMessage(str);
				if(this.onBinaryMessage) {
				//	console.log("CHECKING", typeof msg, msg.constructor)
					if(t(msg, Buffer))
						this.onBinaryMessage(msg);
				}
            }
        });

        ws.on("close", (ws) => {
            this.onClose(ws);
        });
    }
    this.adan = adan;
}

this.AdanServer = AdanServer;
this.CobyAdan = CobyAdan;

module.exports = this;








function stringOrJSON(test) {
    let result;
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
    let result = {"nothing":"not a JSON or a string!"};
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
                let result = [];
                for(let k in this) {
                    result.push(this[k]);
                }
                return result;
            }
        },
        entries: {
            value() {
                let result = [];
                for(let k in this) {
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
                let result = {};
                input.forEach(x => {
                    result[x[0]] = x[1];
                });
                return result;
            }
        },
		
        values: {
            value(obj) {
                let result = [];
                for(let k in obj) {
                    result.push(obj[k]);
                }
                return result;
            }
        },
        entries: {
            value(obj) {
                let result = [];
                for(let k in obj) {
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
		let result = {};
		if(obj) {
			if(t(obj, Object)) {
				for(let k in obj) {
					result[k] = obj[k]
				}
			} else if(t(obj, Array) || obj.hasOwnProperty("length")) {
				result = [];
				for(let i = 0; i < obj.length; i++) result.push(obj[i])
			} else {
				result = obj;
			}
		}
		return result;
}