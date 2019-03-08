let mongoose = require('mongoose');
const server = 'localhost';
const database = 'ScrapingApp';

//mongoose.promise = global.promise;

mongoose.connect(`mongodb://${server}/${database}`,{ useNewUrlParser: true });
/*class Database{
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
}*/

var UserModel = new mongoose.model('user',{
	userName : {
		type : String,
	},
	email : {
		type : String,
	}
});

var ProductModel = new mongoose.model('product',{
	userID : {
		type : mongoose.Schema.Types.ObjectId,
	},
	url : {
		type : String,
	},
	websiteName : {
		type : String,
	},
	productID : {
		type : String,
	},
	price : {
		type : String,
	}
});

module.exports = {
	UserInfo : UserModel,
	ProductModel : ProductModel
}