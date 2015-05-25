var models = require('../models/models.js');

exports.ownershipRequired = function(req, res, next) {
	var objQuizOwner = req.quiz.UserId;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;

	if (isAdmin || objQuizOwner === logUser) {
		next();
	} else {
		res.redirect('/');
	}
};

exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
			where: { id: Number(quizId) },
			include: [{ model: models.Comment }]
		}).then(
		function(quiz) {
			if (quiz) {
				req.quiz=quiz;
				next();
			} else { next (new Error('No existe quizId=' + quizId)); }
		}).catch(function(error) { next(error); });
};

// GET /quizes/:id
exports.show = function(req, res) {
	if (req.user){
		console.log("HAY USUARIO");

		var d = new Date();
		var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
		req.session.user.hora = hora;

		models.User.find({where: { id: req.session.user.id}}).then(function(usuario){
			usuario.getQuizFavs().then(function (favoritos){
				console.log("FAVORITOS");
				if (favoritos.length === 0){
					console.log("NO HAY FAVORITOS");
					req.quiz.esFav= false;
				}
				else{
					console.log("HAY FAVORITOS");
					for (var i = 0; i < favoritos.length; i++){
						if (req.quiz.id === favoritos[i].id){
							req.quiz.esFav = true;
							break;
						}
						else{
							req.quiz.esFav = false;
						}
					}
				}
				res.render('quizes/show', {quiz: req.quiz, errors: []});
			});
		});
	}
	else{
		res.render('quizes/show', {quiz: req.quiz, errors: []});
	}
};
// GET /quizes/:id/answer
exports.answer = function(req, res) {

var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}

	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});	

	if (req.session.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;
		}

};

// GET /quizes
exports.index = function(req, res, next) {
	//Si hay un usuario ON
	if (req.user) {
		var options = {};
		//Actualizar hora (auto LogOut)
		var d = new Date();
		var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
		req.session.user.hora = hora;
		//Mis preguntas
		var url = req.url;
		if(url.indexOf("/quizes/user") === -1){
			options.where = {UserId: req.user.id}
		}
		//Favs+search
		models.User.find({where: { id: req.session.user.id}}).then(function(usuario){
			models.Quiz.findAll(options).then(function(quizes){
				if (req.query.search !== undefined) { //Si hay un search
					var search = req.query.search.replace(/\s/, '%');
					search = "%"+search+"%";
					models.Quiz.findAll({where: ["pregunta like ?", search]},options).then(function(quizzes) {
						console.log(quizzes.length);
						usuario.getQuizFavs().then(function (favoritos){
							for (var i = 0; i<quizzes.length; i++){
								if (favoritos.length === 0){
									quizzes[i].esFav = false;
								}
								else {
									for (var j = 0; j < favoritos.length; j++){
										if (quizzes[i].id === favoritos[j].id){
											quizzes[i].esFav = true;
											break;
										}
										else{
											quizzes[i].esFav = false;	
										}
									}
								}
							}
							res.render('quizes/index', {quizes: quizzes, errors: []});
						});
					});
				}
				else {
					usuario.getQuizFavs().then(function (favoritos){
						for (var i = 0; i<quizes.length; i++){
							if (favoritos.length === 0){
									quizes[i].esFav = false;
							}
							else {
								for (var j = 0; j < favoritos.length; j++){
									if (quizes[i].id === favoritos[j].id){
										quizes[i].esFav = true;
										break;
									}
									else{
										quizes[i].esFav = false;	
									}
								}
							}
						}
						res.render('quizes/index', {quizes: quizes, errors: []});
					});
				}
			});
		}).catch(function(error) {next(error)});
	}
	else{
		//No hay nadie ON pero hay search
		if (req.query.search !== undefined) { //Si hay un search
			var search = req.query.search.replace(/\s/, '%');
			search = "%"+search+"%";
			models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
				res.render('quizes/index', {quizes: quizes, errors: []});
			})
		}
		else{
			//No hay nadie ON ni search
			models.Quiz.findAll().then(function(quizes){
				res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			});
		}
	}
};

exports.new = function(req, res) {
	var quiz = models.Quiz.build (
		{ pregunta: "pregunta", respuesta: "respuesta" });

	res.render('quizes/new', {quiz: quiz, errors: []});

	if (req.session.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;
	}
};

exports.create = function(req, res, next) {

	req.body.quiz.UserId = req.session.user.id;
	if (req.session.user) {
		var d = new Date();
		var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
		req.session.user.hora = hora;
	}

	if (req.files.image) {
		req.body.quiz.image = req.files.image.name;
	}

	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err) { 
		if (err) {
			res.render('quizes/new', {quiz:quiz, errors: err.errors });
		} else {
			quiz.save({fields: ["pregunta", "respuesta", "UserId", "image"]}).then(function() {
				req.url = '/quizes/user/' + req.user.id;
				var quizController = require('./quiz_controller');
				quizController.index(req, res, next);
			})
		}
	});
};

exports.edit = function(req, res) {
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz:quiz, errors: []});

	if (req.session.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;
	}
};

exports.update = function(req, res) {
	if (req.files.image) {
		req.quiz.image = req.files.image.name;
	}	
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(function (err){
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz.save({fields: ["pregunta", "respuesta", "image"]}).then(function() {
			res.redirect('/quizes');});
		}

	});

	if (req.session.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;
	}
};

exports.destroy = function (req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});

	if (req.session.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;
	}
};