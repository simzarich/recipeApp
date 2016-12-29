var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	app = express();

// db connec String
var connect = 'postgres://rich092:123456@localhost/recipedb';

//assign dust engine to .dust files
app.engine('dust', cons.dust);

// default ext. dust
app.set('view engine', 'dust');
app.set('views', __dirname+ '/views');

//set public folder
app.use(express.static(path.join(__dirname,'public')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/vista', function (req, res) {
    res.render('vista');
});

app.get('/', function(req, res){


	pg.connect(connect, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT * FROM recipes', function(err,result){
			if(err){
				return console.err('error runing query', err);
			}
			res.render('index', {recipes: result.rows});
			done();
		});
	});
});

app.post('/add',function(req,res){
	pg.connect(connect, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query("INSERT INTO recipes(name, ingredientes, directions) VALUES($1, $2, $3)",[req.body.name,req.body.ingredientes, req.body.directions]);
		done();
		res.redirect('/');
	});
});


app.delete('/delete/:id', function(req,res){
	pg.connect(connect, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query("DELETE FROM recipes WHERE id = $1",[req.params.id]);
		done();
		res.sendStatus(200);
	});

});

app.post('/edit', function(req, res){
	pg.connect(connect, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query("UPDATE recipes SET name=$1, ingredientes=$2, directions=$3 WHERE id = $4",[req.body.name,req.body.ingredientes, req.body.directions,req.body.id]);
		done();
		res.redirect('/');
	});

});

//
app.listen(3000,function(){
	console.log('server started on port  3000')
});