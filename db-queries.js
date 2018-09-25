const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'ScrapingApp';

inserUserInfo = (db,formData) => {
	return new Promise((resolve,reject) =>{
		
			db.collection('UserInfo').insertOne({userName: formData.name,email:formData.email}, (err, response) => {
				if(err){
					reject('UserInfo Not Inserted');
				}
				let userRecordID = response.ops[0]._id;
				resolve(userRecordID);
			});		
	});
}
exports.newPriceTrack = (data,formData) => {
	
	MongoClient.connect('mongodb://localhost:27017',{ useNewUrlParser: true },(err,client) => {

		assert.equal(null, err, 'Unable to connect to Mongo Server');

		console.log("Connected successfully to server");
		let db = client.db('ScrapingApp');

		if(data){
			
			inserUserInfo(db,formData,data).then( (userRecordID)=>{
				console.log('user ID '+data);
				db.collection('productInfo').insertOne({userID: userRecordID,url:formData.producturl,websiteName: data.site,productID: data.productId,price: data.price}, (err, response) => {
				assert.equal(null, err, 'Record Not Inserted');
				
				client.close();
				});
			}),(errorMessage) =>{
				console.log(`Product Info not inserted. Error {$errorMessage}`);
			}
		}
	});
}