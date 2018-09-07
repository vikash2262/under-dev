const http = require("http");

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const getProductPrice = require("./getprice");

const app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine','handlebars');
app.set('port',3000);

app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) => {
	res.render('home');
});
app.post('/',urlencodedParser,(req,res) => {
	
	var productUrl = req.body['product-url'];
	
	getProductPrice.getPrice(productUrl).then((result) =>{
		console.log(result);
	},(errorMessage) => {
		console.log(errorMessage);
	});
});

app.listen(app.get('port'),() =>{
	console.log(`App is up and running at port ${app.get('port')}`);
});