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

		res.render('quizes/show', {quiz: req.quiz, errors: []});

		if (req.session.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;
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
exports.index = function(req, res) {
	if (req.query.search !== undefined) {
		var search = req.query.search.replace(/\s/, '%');
		search = "%"+search+"%";
		models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
		res.render('quizes/index', {quizes: quizes, errors: []});
		})
	}

	var options = {};
	if (req.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;

			options.where = {UserId: req.user.id}
	}

	models.Quiz.findAll(options).then(
		function(quizes){
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error)});
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

exports.create = function(req, res) {

	req.body.quiz.UserId = req.session.user.id;

	if (req.files.image) {
		req.body.quiz.image = req.files.image.name;
	}

	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err) { 
		if (err) {
			res.render('quizes/new', {quiz:quiz, errors: err.errors });
		} else {
			quiz.save({fields: ["pregunta", "respuesta", "UserId", "image"]}).then(function() {
			res.redirect('/quizes')})
		}
	});

	if (req.session.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;
	}
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