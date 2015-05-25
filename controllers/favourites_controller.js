var models = require('../models/models.js');

exports.favoritear = function (req, res){
	console.log("Se favoritea");
	var quiz = req.quiz;
	var urlredir = '/user/'+req.user.id +'/favourites';
	req.user.addQuizFavs(quiz).then(function(){
		console.log("Acaba");
		res.redirect('/');
	}).catch(function(error){next(error);})

	/*models.Quiz.findAll().then(function(quizes) {
		for (var i = 0;i < quizes.length; i ++){
			if (quizes[i].id === quiz.id){
				console.log("POPIL");
				quizes[i].esFav = true;
			}
		}
		res.render('quizes', {quizes: quizes, errors: []});
	});*/
};

exports.desfavoritear = function(req, res){
	var quiz = req.quiz;
	models.Quiz.findAll().then(function(quizes) {
		for (var i = 0;i < quizes.length; i ++){
			if (quizes[i].id === quiz.id){
				console.log("POPIL");
				quizes[i].esFav = false;
			}
		}
		res.render('quizes', {quizes: quizes, errors: []});
	});
};

exports.mostrar = function (req, res){

};