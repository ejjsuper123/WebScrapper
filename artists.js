var url = require('url')
var nodemailer = require('nodemailer');
var cheerio = require('cheerio');
var request = require('request');
var path = require('path');
var express = require("express");
var bodyParser = require('body-parser');
const credentials = require('./credentials.json');
var app = express();
var finalarr = []; //used at the end
var artistsarr = process.argv.slice(2); //makes array and starts it at the 3rd argument 
var count = 0 //initialize
const newarr = [25]; //to only capture the top 25 songs
const newart = [25];
request('http://www.popvortex.com/music/charts/top-rap-songs.php', function (error, response, html) {
	if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        // Not to be confused with forEach, this is jQuery
        $('em.artist').each(function(i, element) {
                 newarr[i] = ($(this).text());
                 
            //created two different array and combining them later
                 
        });
        $('cite.title').each(function(i, element) {
                newart[i] = ($(this).text());
                
   });
        
    }
    var arr = [];
    for(let i = 0; i <25; i++){
    arr[i] =(newarr[i] + " " + newart[i]); // combined arrays for cleaner format
    
    }
    //for artistsarr length 
    for (let i = 0; i < artistsarr.length; i ++){
    // run inner loop that goes through every name and if it contained then print it out 
        for(let j = 0; j < arr.length; j++){
            if(arr[j].includes(artistsarr[i])){
                finalarr[count] = arr[j]
                count++ //count to determine later if artist is in top 25 or not
            } 
    
        }   
    }  
    
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'bnancetest1212@gmail.com', 
      pass: 'testP@ssword1234', 
    },
    tls:{
        rejectUnauthorized:false
    }
  });

// send mail with defined transport object
  let mailOptions = {
    from: credentials.from, // sender address
    to: credentials.to, // list of receivers
    subject: credentials.subject, // Subject line
    text: finalarr.toString().replace(/,/g, "\n"), // plain text body
    html: finalarr.toString().replace(/,/g, '<br>'), // html body
  };
  if (count >=1){
  transporter.sendMail(mailOptions,(error,info) => {
    if (error){
        return console.log(error)
    }
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  });
}
else if(artistsarr[0] == undefined ){//validation 
    console.log("No artist entered!")
}
else 
    console.log("Artist not in top 25!") //validation for not in top 25
});