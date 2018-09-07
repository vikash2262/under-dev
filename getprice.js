const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const stripHtmlComments = require('strip-html-comments');

var getPrice = (webUrl)=>{
	
	return new Promise((resolve,reject) => {
		
		request(webUrl, (error, reponse, body) => {
			if(error){
				reject("Unable to connect to servers now.Please try again later");
			}else{
				
				q = url.parse(webUrl, true);

				if(q.host === 'www.flipkart.com'){
					
					productId = q.query.pid;
					var $ = cheerio.load(body);
					var getName = $('._3e7xtJ').find('._35KyD6').html();
					if(getName){
						getName = stripHtmlComments(getName.trim());
					}
					var getPrice = $('._3e7xtJ').find('._3qQ9m1').html();
					if(getPrice){
						getPrice = getPrice.replace('&#x20B9;','');
					}
					resolve({
						site: 'flipkart',
						productId: productId,
						name: getName,
						price: getPrice
					});
				}else if(q.host === 'www.amazon.in'){
										
					var $ = cheerio.load(body);
					var productId = $('#a-page').find('#prodDetails .col2 table tbody tr td:nth-child(2)').html();
					var getName = $('#a-page').find('#productTitle').html();
					if(getName){
						getName = getName.replace(/\n/g,'').trim();
					}
					var getPrice = $('#a-page').find('#priceblock_ourprice').contents()[1].data;
					console.log(getPrice);
					if(getPrice){
						getPrice = getPrice.trim();
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

module.exports.getPrice = getPrice;