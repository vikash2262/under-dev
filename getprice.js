const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const stripHtmlComments = require('strip-html-comments');
var HttpsProxyAgent = require('https-proxy-agent');

var proxy = 'http://36.81.2.206:31281';
var agent = new HttpsProxyAgent(proxy);

var getProductdetails = (webUrl)=>{
	
	return new Promise((resolve,reject) => {
		
		request({uri: webUrl,agent: agent,method: "POST",headers: {'content-type': 'application/x-www-form-urlencoded'},	agent: agent,timeout: 10000,maxRedirects: 10}, (error, reponse, body) => {
			if(error){
				console.log(error);
				reject("Unable to connect to servers now.Please try again later");
			}else{
				
				q = url.parse(webUrl, true);

				if(q.host === 'www.flipkart.com'){
					
					var $ = cheerio.load(body);
					
					//Get Product unique ID
					productId = q.query.pid;
					
					//Get Product Name
					try{
						var getName = $('._3e7xtJ').find('._35KyD6').html();
						if(getName){
							getName = stripHtmlComments(getName.trim());
						}
					}catch(err){
						reject("Some problem occured.Please try again later");
					}
					
					//Get Product Price
					try{
						var getPrice = $('._3e7xtJ').find('._3qQ9m1').html();
						if(getPrice){
							getPrice = getPrice.replace('&#x20B9;','');
						}
					}catch(err){
						reject("Some problem occured.Please try again later");
					}
					
					resolve({
						site: 'flipkart',
						productId: productId,
						name: getName,
						price: getPrice
					});
				}else if(q.host === 'www.amazon.in'){
										
					var $ = cheerio.load(body);
					
					//Get Product unique ID
					try{
						var productId = $('#a-page').find('#prodDetails .col2 table tbody tr td:nth-child(2)').html();
						if(productId){
							if(!productId){
								var canonicalTag = $('link[rel="canonical"]');
								getAmazonurl = canonicalTag.attr('href');
								productId = getAmazonurl.split("/").pop();
							}
						}else{
							productId = $('#faddAsin').html();
						}						
					}catch(err){
						reject("Some problem occured while getting productID.Please try again later");						
					}
					
					//Get Product Title
					var getName = $('#a-page').find('#productTitle').html();
					if(getName){
						getName = getName.replace(/\n/g,'').trim();
					}
					
					//Get Product Price
					try{
						//var getPrice = $('#a-page').find('#priceblock_ourprice').contents()[1].data;
						var getPrice = $('#priceblock_ourprice').find('.currencyINR').remove().html();
						//getPrice = getPrice.trim();
					}catch(err){
						//var getDivContent = $('#priceblock_ourprice').html();
						//console.log(err);
						reject("Some problem occured while getting product price.Please try again later");
					}
					resolve({
						site: 'amazon',
						productId: productId,						
						name: getName,
						price: getPrice
					});					
				}
			}
		});
	});
};

var checkCaptcha = (secretKey,captchaVal,req) => {
	return new Promise((resolve,reject) =>{
		var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + captchaVal + "&remoteip=" + req.connection.remoteAddress;	

		request(verificationUrl,function(error,response,body) {
			CaptchaResponseBody = JSON.parse(body);
			console.log(CaptchaResponseBody.success);
			if(CaptchaResponseBody.success === true){
				resolve();
			}else{
				reject('Invalid Captcha.');
			}
		});		
	});
}

module.exports = {
	getProductdetails : getProductdetails,
	checkCaptcha : checkCaptcha
}