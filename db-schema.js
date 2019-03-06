let mongoose = require('mongoose');
var Schema = mongoose.Schema;

const server = 'localhost';
const database = 'ScrapingApp';

class Database{
	constructor(){
		this.connect();
	}

	connect(){
		mongoose.connect(`mongodb://${server}/${database}`).then( () =>{
			console.log('DB Connection success');
		}).catch( err =>{
			console.log('DB Connection Fail');
		});
	}
}

var UserSchema = new Schema({
	userName : String,
	email : String
});

module.exports = mongoose.model('UserInfo',UserSchema);