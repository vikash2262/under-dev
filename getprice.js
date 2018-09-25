const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const stripHtmlComments = require('strip-html-comments');

var getProductdetails = (webUrl)=>{
	
	return new Promise((resolve,reject) => {
		
		request(webUrl, (error, reponse, body) => {
			if(error){
				reject("Unable to connect to servers now.Please try again later");
				//console.log(error);
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
						if(!productId){
							var canonicalTag = $('link[rel="canonical"]');
							getAmazonurl = canonicalTag.attr('href');
							productId = getAmazonurl.split("/").pop();
						}						
					}catch(err){
						reject("Some problem occured.Please try again later");						
					}
					
					//Get Product Title
					var getName = $('#a-page').find('#productTitle').html();
					if(getName){
						getName = getName.replace(/\n/g,'').trim();
					}
					
					//Get Product Price
					try{
						var getPrice = $('#a-page').find('#priceblock_ourprice').contents()[1].data;
						getPrice = getPrice.trim();console.log(getPrice);
					}catch(err){
						getDivContent = $('#a-page').find('#priceblock_ourprice').html();
						console.log(err);
						reject("Some problem occured.Please try again later");
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

module.exports.getProductdetails = getProductdetails;