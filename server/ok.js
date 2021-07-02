var prs = require("node-html-parser").parse;
var coby = require("./COBY.js"),
	fs = require("fs")
var database = [];
var path = (
	"./database.txt"
//	"./database2.json"
);
var words = [];
var curID, curWord;
database.forEach((x, i)=>{
	x.id = id() + i
	
//	x.color = color()
	

});

function color() {
	return splat[
		Math.floor(
			Math.random() * 
			splat.length
		)
	]
}

function id() {
	return coby.mapAt(
		(Date.now()) + 
		(Math.random() * 10 )
		+ "" 
	)
}
coby.adanServer({
		server(q,r) {
			r.end("ASD")
		},
		port:770,
		onOpen(css,cs) {
			
			fs.readFile("maamers/maamer1.txt", "utf8", (error, data) => {
				
				if(error) {
					console.log(error);
				} else {
					console.log("K",data)
					readWords((w) => {
						cs.send({
							"maamer loaded": data,
							wordsLoaded: w
						})
					})
				}
			});
		},
		adanFunctions:{
			onMaweemir(ms,cs) {
				
			},
			"word clicked": (ms,cs) => {
				cs.send({
					"selected":ms
				})
			},
			"new word": (obj,cs) => {
				if(obj.word) {
					var id = obj.id
					if(typeof(id) == "number") {
						curWord = obj.word;
						words[id] = curWord
						curID = id
						cs.send({
							"word added": 
							{idx:curID,word:curWord}
						})
						saveWords(er=>{
							cs.send({
								finishedSaving: 
								{er,idx:curID,word:curWord}
							})
						});
					}
				}
			}
		}
			
})

function readWords(cb) {
	fs.readFile("./data/words.txt", "utf8", (error, data) => {
		cb(data,error)
	})
}
function saveWords(cb) {
	fs.writeFile("./data/words.txt", JSON.stringify(words), function(err) {
		if(err) {
			cb(err);
		} 

		console.log("saved it!");
		cb(0)
	})
}