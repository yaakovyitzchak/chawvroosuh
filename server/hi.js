var coby = require("./COBY.js"),
	clients = [];
coby.adanServer({
	port:771,
	server(q,r) {
		r.end("well")
	},
	adanFunctions: {
		yo(msg,cs) {
			cs.send({
				wow: 2
			})
			console.log("YO!")
		},
		welcome(msg, cs) {
			console.log("hi",msg);
			cs.server.broadcast({
				newPlayer:msg
			},{
				current: cs
			});
			cs.send({
				otherThings: clients.map(x => ({
					uid: x.uid,
					position: x.position
				}))
			})
		},
		update(msg, cs) {
			
			var found = clients.find(x => 
				x.uid == msg.uid
			)
			if(found) {
				found.position = msg.position;
			}
			
			cs.server.broadcast({
				updated:clients.map(x=>({
					uid: x.uid,
					position: x.position
				}))
			},{
				current: cs
			});
		},
		no(msg, cs) {
			console.log(msg);
		},
		test(msg, cs) {
			//console.log("GOT it", msg);
			var msg1 = msg;
			try {
				msg1 = JSON.parse(msg)
			} catch(e) {}
			cs.server.broadcast(msg1);
		},
		well(msg, cs) {
			console.log("hi there!", msg);
			cs.send({
				hi:"bye"
			})
		}
	},
	onClose(cs) {
		
		var ind = null;
		clients.forEach((x,i) => {
			if(x.uid == cs.uid) {
				ind = i
			}
		})
		if(ind !== null) {
			cs.server.broadcast({
				someoneLeft:cs.uid
			},{
				current: cs
			});
			clients.splice(
				ind, 1
			);
			console.log(clients.length);
		}
		
		console.log("bye",cs.uid,clients.map(x=>({uid:x.uid})));
	},
	onOpen(css,cs) {
		
		cs.uid = Math.floor(
			Date.now() + Math.random() * 20
		)+"";
		clients.push({
			uid: cs.uid,
			socket: cs
		});
		
		console.log("hi!", clients.map(x=>({uid:x.uid})));
		cs.send({
			//a:2
			uid: cs.uid
		});
	}
})