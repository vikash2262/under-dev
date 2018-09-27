const http = require("http");

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const validUrl = require('valid-url');
const validEmail = require("email-validator");
const request = require('request');
const session = require('express-session')
var cookieParser = require('cookie-parser');
var cron = require('node-cron');

const getProductPrice = require("./getprice");
const dbQuery = require("./db-queries");

const app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var urlencodedParser = bodyParser.urlencoded({extended: false});
const secretKey = '6Lcy_XEUAAAAAMFWtvbDCsnSgOSCtVIR-192a0I4';

app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine','handlebars');
app.set('port',3000);

app.use(express.static(__dirname + '/public'));
app.use(session({ key:'user_id' ,secret: '120-890', cookie: { maxAge: 60000 }, saveUninitialized: false, resave: false}));
app.use(cookieParser());

app.use((req, res, next) => {
    if (req.cookies.user_id && !req.session.user) {
        res.clearCookie('user_id');        
    }
    next();
});

app.listen(app.get('port'),() =>{
	console.log(`App is up and running at port ${app.get('port')}`);
});

app.get('/', (req,res) => {
	console.log('Session home page: '+req.session.user);
	res.render('home');
});

//https://github.com/express-validator/express-validator/tree/v4.0.0
//https://wesleytsai.io/2015/08/02/mongodb-connection-pooling-in-nodejs/

app.post('/',urlencodedParser,(req, res, next) => {
	
	var productUrl = req.body['producturl'];
	var userName = req.body['name'];
	var emailVal = req.body['email'];
	var captchaVal = req.body['g-recaptcha-response'];
	var errorMessage = []; 
	var success = err = successMessage = '';
	
	if(!(validEmail.validate(emailVal))){
		errorMessage.push('Please specify a valid Email.');
	}
	
	if(!(validUrl.isUri(productUrl))){
		errorMessage.push('Please specify a valid URL.');
	}
	
	//Validate Captcha
	getProductPrice.checkCaptcha(secretKey,captchaVal,req).then(()=>{

		if(errorMessage.length <= 0){
			getProductPrice.getProductdetails(productUrl).then((result) =>{
				dbQuery.newPriceTrack(result,req.body);
				successMessage = 'Your request for this URL is successfully saved. You will be notified';
				res.render('home', {
					success: successMessage
				});
			},(errorMsg) => {
				errorMessage.push(errorMsg);
				res.render('home', {
					err: errorMessage,
				});
			});
		}else{
			res.render('home', {
				err: errorMessage,
			});
		}
	},(errorMsg) => {
		errorMessage.push(errorMsg);
		res.render('home', {
			err: errorMessage,
		});
	});
	console.log(`Error: ${errorMessage}`);
	//next();
});

app.get('/admin-login', (req,res) => {
	console.log('Session login page: '+req.session.user);
	if (req.session.user && req.cookies.user_id) {
		return res.redirect('/admin-dashboard');
	}else{
		res.render('login');
	}
});

app.post('/admin-login',urlencodedParser,(req, res, next) => {
		
	var usernameVal = req.body['username'];
	var passwordVal = req.body['password'];
	var captchaVal = req.body['g-recaptcha-response'];
	var errorMessage = []; 
	var success = err = successMessage = '';
	
	if(usernameVal == ''){
		errorMessage.push('Please specify Username.');
	}	
	if(passwordVal == ''){
		errorMessage.push('Please specify Password.');
	}
	
	//Validate Captcha
	getProductPrice.checkCaptcha(secretKey,captchaVal,req).then(()=>{
		if(errorMessage.length <= 0){
			req.session.user = 1;
			return res.redirect('/admin-dashboard');
			//next();
		}else{
			res.render('login', {
				err: errorMessage,
			});
		}
	
	},(errorMsg) => {
		errorMessage.push(errorMsg);
		res.render('home', {
			err: errorMessage,
		});
	});
});	

app.get('/admin-dashboard', (req,res) => {

	if (!req.session.user && !req.cookies.user_id) {
		return res.redirect('/admin-login');
	}
	
	var getUserlist = '';
	dbQuery.getUserlist().then((result) =>{
		getUserlist = result;
		res.render('admin-dashboard',{'getUserlist' : getUserlist});
	},(errorMessage) => {
		console.log(errorMessage);
		res.render('admin-dashboard',{'err' : errorMessage});
	});

});

/*cron.schedule('* * 24 * *', () => {
  console.log('running a task every minute');
});*/
