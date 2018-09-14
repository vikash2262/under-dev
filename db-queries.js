const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'ScrapingApp';

exports.newPriceTrack = (data) => {
	
	MongoClient.connect('mongodb://localhost:27017',{ useNewUrlParser: true },(err,client) => {

		assert.equal(null, err, 'Unable to connect to Mongo Server');

		console.log("Connected successfully to server");
		let db = client.db('ScrapingApp');
		
		db.collection('inserts').insertOne({userName: data[userName], email: data[email], productSKU: data[productSKU]}, (err, response) => {
		assert.equal(null, err, 'Record Not Inserted');
		
		assert.equal(1, r.insertedCount);
		console.log(response.ops[0]);
		});
		client.close();
	});
}