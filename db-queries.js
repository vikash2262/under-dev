let UserInfo = require('./db-schema');

var User = new UserInfo({userName: 'vik',email:'vik@gmail.com'});
			User.save((err, response) => {
				console.log(UserInfo);
			if(err){ throw err;
				console.log(err);
			}else{
				console.log("Document Save Done");
			}

			});
console.log('ccc');
/*inserUserInfo = (db,formData) => {
	return new Promise((resolve,reject) =>{

			var User = new UserInfo({userName: formData.name,email:formData.email});
			User.save((err, response) => {
				if(err){
					reject('UserInfo Not Inserted');
				}
				let userRecordID = response.ops[0]._id;
				resolve(userRecordID);
			});		
	});
}

exports.newPriceTrack = (data,formData) => {
	

}*/