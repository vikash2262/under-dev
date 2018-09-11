const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var state = {
	db: null
}

module.exports.connect = (url, done)=>{
	
	if(state.db) return done();
	
	MongoClient.connect(url,{ useNewUrlParser: true },(err,client) => {
		assert.equal(null, err);
		
		state.db = client.db("ScrapingApp");

		//state.db.createCollection('abc');
		return done();
	});	
	
}

module.exports.get = () =>{
	//console.log(state.db);
	return state.db;
}

module.exports.closecon = () =>{
	if(state.db){
		console.log('Connection closed');
		state.db.close();
	}
}