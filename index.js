const http = require("http");

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

const getProductPrice = require("./getprice");
const db = require("./mongodb-connect");
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'ScrapingApp';

const app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine','handlebars');
app.set('port',3000);

app.use(express.static(__dirname + '/public'));

db.connect('mongodb://localhost:27017',(err) =>{
console.log(err);
	if(err){
		console.log('Unable to connect to Mongo Server');
		process.exit(1);
	}
	app.listen(app.get('port'),() =>{
		console.log('Connected to Mongo Server');
		console.log(`App is up and running at port ${app.get('port')}`);
	});
});

app.get('/', (req,res) => {
	res.render('home');
});

///////////
//https://wesleytsai.io/2015/08/02/mongodb-connection-pooling-in-nodejs/
//const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');

// Connection URL
//const url = 'mongodb://localhost:27017';

// Database Name
//const dbName = 'scraping';

// Use connect method to connect to the server
/*MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

//db.createCollection('test');
console.log(db);
});*/

///////////

app.post('/',urlencodedParser,(req,res) => {

	var productUrl = req.body['product-url'];

	getProductPrice.getPrice(productUrl).then((result) =>{
				
		res.render('home', {
			message: 'Your request for this URL is successfully saved. You will be notified'
		});		
	},(errorMessage) => {
		res.render('home', {
			message: 'Something went Wrong.Please try again later!'	
		});
	});
});