const http = require("http");

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const validUrl = require('valid-url');
const validEmail = require("email-validator");

const getProductPrice = require("./getprice");
const dbQuery = require("./db-queries");

const app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var urlencodedParser = bodyParser.urlencoded({extended: false});
var dba;

app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine','handlebars');
app.set('port',3000);

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'),() =>{
	console.log(`App is up and running at port ${app.get('port')}`);
});

app.get('/', (req,res) => {
	res.render('home');
});
//https://github.com/express-validator/express-validator/tree/v4.0.0
///////////
//https://wesleytsai.io/2015/08/02/mongodb-connection-pooling-in-nodejs/
///////////

//dbQuery.newPriceTrack(db,{userName: 'vikash', email: 'vikash.jal.mca@gmail.com', productSKU: '123456'});

app.post('/',urlencodedParser,(req, res, next) => {
		
	var productUrl = req.body['producturl'];
	var userName = req.body['name'];
	var emailVal = req.body['email'];
	var errorMessage = []; 
	var success = err = successMessage = '';
	
	if(!(validEmail.validate(emailVal))){
		errorMessage.push('Please scpecify a valid Email.');
	}
	
	if(!(validUrl.isUri(productUrl))){
		errorMessage.push('Please scpecify a valid URL.');
	}
	
	//console.log(errorMessage);
	if(errorMessage.length <= 0){
		//console.log('do');
		getProductPrice.getProductdetails(productUrl).then((result) =>{
			
			//console.log(result.name);
			//Insert into DB
			//dbQuery.newPriceTrack({userName: 'vikash', email: userName, productSKU: '123456'});
			dbQuery.newPriceTrack(result,req.body);
			successMessage = 'Your request for this URL is successfully saved. You will be notified'
			res.render('home', {
				success: successMessage
			});
		},(errorMessage) => {
			res.render('home', {
				err: errorMessage,
			});
		});		
	
	}else{
		//console.log('donot');
		res.render('home', {
			err: errorMessage,
		});
	}
	//next();
});

