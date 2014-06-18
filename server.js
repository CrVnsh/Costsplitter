var express = require("express");
var logfmt = require("logfmt");
var mongoose = require("mongoose");
var app = express();

app.use(logfmt.requestLogger());

var Schema = mongoose.Schema;

mongoose.connect('mongodb://sham:costsplit123@ds061797.mongolab.com:61797/db1');

var groups = mongoose.model('Groups', new Schema({ 
	name: String
}),'groups');

var persons = mongoose.model('Persons', new Schema({ 
	name: String,
	group_id : String,
}),'users');

var expenses = mongoose.model('Expenses', new Schema({ 
	descr: String,
	value : Number,
	date : String,
	person_id : String
}),'expenses');


app.use(express.bodyParser());
app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users


//Groups

app.get('/api/groups', function(req, res, next) {
	groups.find(function(err, data) {
		if(err) res.json(err);
		else res.json(data);
	});
});

app.post('/api/groups', function(req, res) {
		groups.create({
			name: req.body.name
		}, function(err, data) {
			console.log(req.body.name);
			if (err)
				res.send(err);
			groups.find(function(err, data) {
				if (err) res.send(err);
				else res.json(data);
			});
		});
	});

app.put('/api/groups/:group_id', function(req,res){
	groups.findById(req.params.group_id ,function(err,data){
		data.name = req.body.name;
		data.save(function(err, data) {
			if (err)
				res.send(err);
			groups.find(function(err, data) {
				if (err) res.send(err);
				else res.json(data);
			});
		});
	});
});

app.delete('/api/groups/:group_id', function(req,res){
	groups.remove({
		_id : req.params.group_id
	},function(err, data) {
			if (err) res.send(err);
			groups.find(function(err, data) {
				if (err)
					res.send(err)
				res.json(data);
			});
	});
});


//Personen

app.get('/api/persons/:group_id', function(req, res, next) {
	persons.find({'group_id' : req.params.group_id},function(err, data) {
		console.log(req.params.group_id);
		if(err) res.json(err);
		else res.json(data);
	});
});

app.post('/api/persons', function(req, res) {
		persons.create({
			name: req.body.name,
			group_id: req.body.groupid,
			valuesum : 0
		}, function(err, data) {
			
			if (err)
				res.send(err);
			persons.find({'group_id' : req.body.groupid}, function(err, data) {
				console.log(req.body.groupid);
				if (err) res.send(err);
				else res.json(data);
			});
		});
	});

app.delete('/api/persons/:person_id/:group_id', function(req,res){
	persons.remove({
		_id : req.params.person_id
	},function(err, data) {
		if (err) res.send(err);
		persons.find({'group_id' : req.params.group_id},function(err, data) {
			if (err)res.send(err)
			res.json(data);
		});
	});
});
app.delete('/api/personexpenses/:person_id', function(req,res){
	expenses.remove({
		person_id : req.params.person_id
	},function(err, data) {
		if (err) res.send(err);
		});
	});


//Betrag

app.get('/api/expenses/:person_id', function(req, res, next) {
	expenses.find({'person_id' : req.params.person_id},function(err, data) {
		if(err) res.json(err);
		res.json(data);
	});
});

app.post('/api/expenses', function(req, res) {
		expenses.create({
			descr: req.body.descr,
			value : req.body.value,
			date : req.body.date,
			person_id: req.body.personid
		}, function(err, data) {
			console.log(req.body.personid);
			if (err)
				res.send(err);
			expenses.find({'person_id' : req.body.personid}, function(err, data) {
				
				if (err) res.send(err);
				res.json(data);
			});
		});
	});


app.delete('/api/expenses/:expense_id/:person_id', function(req,res){
	expenses.remove({
		_id : req.params.expense_id
	},function(err, data) {
		console.log("Ich bin drin");
		if (err) res.send(err);
		expenses.find({'person_id' : req.params.person_id},function(err, data) {
			if (err)res.send(err)
			res.json(data);
		});
	});
});


app.get('*', function(req, res, next) {
  res.type('html');
  res.sendfile('./public/views/index.html'); // load our public/views/index.html file
});

// routes ==================================================
//require('./app/routes')(app); // configure our routes
var port = Number(process.env.PORT || 5000);

// start app ===============================================
app.listen(port);										// startup our app at http://localhost:8080
console.log('Magic happens on port ' + port); 			// shoutout to the user