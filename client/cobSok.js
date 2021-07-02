//B"H
function io(url) {
	var ws = new WebSocket(url);
	function emit(tx, ob) {
		ws.send(JSON.stringify({
			[tx]: ob
		}))
	}
	
	var fncs = {}
	function on(ms, fnc) {
		fncs[ms] = fnc
		console.log(fncs)
	}
	
	ws.onmessage = e => {
		var p = JSON.parse(e.data)
		for(var k in p) {
			
			var f = fncs[k]
			console.log(f,k)
			if(typeof(f) == "function") {
				f(p[k])
			}
		}
	}
	function k() {
		this.on = on
		this.emit = emit
	}
	return new k()
}