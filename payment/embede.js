// Set express as Node.js web application
// server framework.
// To install express before using it as
// an application server by using
// "npm install express" command.
const express = require('express');
const Razorpay = require('razorpay');
const app = express();
const razorpay=require('razorpay')
var raz=new razorpay({
     key_id: 'rzp_test_ttnvmIbSqbVddU',

    // Replace with your key_secret
    key_secret: '3p9woJSYoQhcNqKL2kBaW9tx'
})
// Set EJS as templating engine
var options = {
	"key": "rzp_test_ttnvmIbSqbVddU",
	"amount": "4666",
	"currency": "INR",
	"name": "Dummy Academy",
	"description": "Pay & Checkout this Course, Upgrade your DSA Skill",
	"image": "https://media.geeksforgeeks.org/wp-content/uploads/20210806114908/dummy-200x200.png",
	"order_id": "order_MbhiQ6Te9tRhY3",
	"handler": function (response){
		console.log(response)
		alert("This step of Payment Succeeded");
	},
	"prefill": {
		//Here we are prefilling random contact
		"contact":"9876543210",
		//name and email id, so while checkout
		"name": "Twinkle Sharma",
		"email": "smtwinkle@gmail.com"
	},
	"notes" : {
		"description":"Best Course for SDE placements",
		"language":"Available in 4 major Languages JAVA,C/C++, Python, Javascript",
		"access":"This course have Lifetime Access"
	},
	"theme": {
		"color": "#2300a3"
	}
};

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

	// The render method takes the name of the HTML
	// page to be rendered as input
	// This page should be in the views folder
	// in the root directory.
	res.render('pay',{Razorpays:razorpay,options:options});

});

const server = app.listen(4000, function () {
    console.log('listening to port 4000')
});