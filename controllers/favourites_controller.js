var models = require('../models/models.js');

exports.favoritear = function (req, res, next){
	console.log("Se favoritea");
	var quiz = req.quiz;
	//var url = req.body.redir || '/user/' + req.user.id + '/favourites';
	var quizController = require('./quiz_controller');
	req.url = '/quizes/user/' + req.user.id;

	req.user.addQuizFavs(quiz).then(function(){
		console.log("Acaba dentro");
		quizController.index(req, res, next);
		//res.redirect(url);
	}).catch(function(error){next(error);})
};

exports.desfavoritear = function(req, res, next){
	console.log("Se desfavoritea");
	var quiz = req.quiz;
	//var url = req.body.redir || '/user/' + req.user.id + '/favourites';
	var quizController = require('./quiz_controller');
	req.url = '/quizes/user/' + req.user.id;

	req.user.removeQuizFavs(quiz).then(function(){
		console.log("Acaba fuera");
		quizController.index(req, res, next);
		//res.redirect(url);
	}).catch(function(error){next(error);})
};

exports.mostrar = function (req, res){
	req.user.getQuizFavs().then(function(favoritos){
		if (favoritos.length > 0){
			for (var j = 0; j < favoritos.length; j++){
				favoritos[j].esFav = true;
			}
		}
		res.render('quizes/index.ejs', {quizes: favoritos, errors: []});
	})

};