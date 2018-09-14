const http = require("http");

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

const getProductPrice = require("./getprice");
const dbQuery = require("./db-queries");

const app = express();

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

///////////
//https://wesleytsai.io/2015/08/02/mongodb-connection-pooling-in-nodejs/
///////////

//dbQuery.newPriceTrack(db,{userName: 'vikash', email: 'vikash.jal.mca@gmail.com', productSKU: '123456'});

app.post('/',urlencodedParser,(req,res) => {
		
	var productUrl = req.body['product-url'];

	getProductPrice.getPrice(productUrl).then((result) =>{
		
		//Insert into DB
		dbQuery.newPriceTrack({userName: 'vikash', email: 'vikash.jal.mca@gmail.com', productSKU: '123456'});
		
		res.render('home', {
			message: 'Your request for this URL is successfully saved. You will be notified'
		});
	},(errorMessage) => {
		res.render('home', {
			message: errorMessage
		});
	});
});

