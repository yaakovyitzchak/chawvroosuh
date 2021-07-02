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
	}/*,
	database: {
		//url: "mongodb://localhost:27017",
		url: "mongodb://asdf:fdsa@cluster0-shard-00-00.secyp.mongodb.net:27017,cluster0-shard-00-01.secyp.mongodb.net:27017,cluster0-shard-00-02.secyp.mongodb.net:27017/atzmus?ssl=true&replicaSet=atlas-i7f2xi-shard-0&authSource=admin&retryWrites=true&w=majority",
		admin: {
			username: "hi",
			password: "bye"
		},
		databaseCommand: "well"
	}*/
})