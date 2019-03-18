let dbschema = require('./db-schema');
UserModel = dbschema.UserModel;
ProductModel = dbschema.ProductModel;

/*inserUserInfo = (formData) => {
	return new Promise((resolve,reject) =>{
			//var User = new UserInfo({userName: 'vik',email:'vik@gmail.com'});
			var User = new UserModel({userName: formData.name,email:formData.email});
			User.save().then((response) => {
				//console.log("Document Save Done",response);
				let userRecordID = response.ops[0]._id;
				resolve(userRecordID);				
			},(err) => {
				reject('UserInfo Not Inserted');
			});
	});
}
exports.newPriceTrack = (data,formData) => {
	
		if(data){
			inserUserInfo(formData,data).then( (userRecordID) => {
				var User = new ProductModel({userID: userRecordID,url:formData.producturl,websiteName: data.site,productID: data.productId,price: data.price});
				
				User.save().then((response) => {
					resolve('Product Info Inserted');
				},(err) => {
					reject('Product Info Not Inserted');
				});
			}),(errorMessage) =>{
				console.log(`Product Info not inserted. Error {$errorMessage}`);
			}
		}
}*/


exports.newPriceTrack = (data,formData) => {
	
		if(data){

			var User = new UserModel({userName: formData.name,email:formData.email});
			
			User.save().then((response) => {
				
				let userRecordID = response.ops[0]._id;
				//resolve(userRecordID);
				
				var User = new ProductModel({userID: userRecordID,url:formData.producturl,websiteName: data.site,productID: data.productId,price: data.price});
				
				User.save().then((response) => {
					resolve('Product Info Inserted');
				},(err) => {
					reject('Product Info Not Inserted');
				});
				
			},(err) => {
				reject('UserInfo Not Inserted');
			});
		}
}
