const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'ScrapingApp';

exports.newPriceTrack = (data,formData) => {
	
	MongoClient.connect('mongodb://localhost:27017',{ useNewUrlParser: true },(err,client) => {

		assert.equal(null, err, 'Unable to connect to Mongo Server');

		console.log("Connected successfully to server");
		let db = client.db('ScrapingApp');
		var userRecordID = '';
		//console.log(data);
		if(data){
			
			db.collection('UserInfo').insertOne({userName: formData.name,email:formData.email}, (err, response) => {
			assert.equal(null, err, 'Record Not Inserted');
			
			//assert.equal(1, response.insertedCount);
			//console.log("Record added as "+response.insertedId);
			
			userRecordID = response.ops[0]._id;
			});
			
			db.collection('productInfo').insertOne({userID: userRecordID,url:formData.producturl,websiteName: data.site,productID: data.productId,price: data.price}, (err, response) => {
			assert.equal(null, err, 'Record Not Inserted');
			});
			
			console.log(userRecord);			
		}
		client.close();
	});
}