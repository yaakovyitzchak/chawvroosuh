//B"H
function io(url) {
	var ws = new WebSocket(url);
	ws.onerror = e => {}
	var oyk = new k()
	function emit(tx, ob) {
		if(ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({
				[tx]: ob
			}))
		} else if(fkSrvCmdz) {
			var k = fkSrvCmdz[tx]
			if(typeof(k) == "function")
				k(ob, oyk)
		}
	}
	
	
	
	var fncs = {}
	function on(ms, fnc) {
		fncs[ms] = fnc
		console.log(fncs)
	}
	
	function forceEmit(tx, ob) {
		var oy = {}
		oy[tx] = ob
		msgify({
			data:JSON.stringify(oy)
		})
	}
	
	ws.onmessage = e => {
		msgify(e)
	}
	
	var msgify = e => {
		var p = JSON.parse(e.data)
		for(var k in p) {
			var f = fncs[k]
			if(typeof(f) == "function") {
				f(p[k])
			}
		}
	}
	
	var fkSrvCmdz = {}
	function fakeServer(cmdz) {
		fkSrvCmdz = cmdz
	}
	
	function k() {
		this.on = on
		this.emit = emit
		this.forceEmit = forceEmit
		this._m = msgify
		this.fakeServer = fakeServer
	}
	return oyk
}

function hashify(o,t,u) {	
	var tst;
	try {
		tst = new URL(rr.value)
	} catch(e){}

	return (
		tst ? 
		tst.href.replace(tst.hash, ""):""
	) + "#" + (
		o ? 
		"maweemir=" + encodeURIComponent(o) : ""
	) + 
	(
		o ? "$" : ""
	) +
	(
		t ?
		"dvareem=" +  encodeURIComponent(t) : ""
	)
}

function unhashify(loyk) {
	return (typeof(loyk) == "string" ?
	Object.fromEntries(loyk.substring(1).split("$")
	.map(x => 
		x.split("=")
		.map((y,i)=>(i > 0 ? try64ify(y) : y))
		//.map(y => tryPrsOrIt(y))
	).filter(x=>x.filter(y=>y))) : ({}))
}

function unURLify(o) {
	return unhashify(
		o[0] == "#" ? k.value : 
		(url => (url ? url.hash : "{}"))(tryIn(() => new URL(o)))
	)
}
function tryStrang(w) {
	try {
		return JSON.stringify(w)
	} catch(e) {return null}
}

function try64ify(maweem) {
	if(!maweem) return null;
	try {
		return decodeURIComponent(maweem)
	} catch(e) {return maweem}
}

function tryPrsOrIt(w) {
	try {
		return JSON.parse(w)
	} catch(e) {return w}
}
function tryPrs(w) {
	try {
		return JSON.parse(w)
	} catch(e) {return null}
}

function tryIn(fnc) {
	try {
		return fnc(1)
	} catch(e) {
		return fnc(0)
	}
}