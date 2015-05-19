var models = require('../models/models.js');

exports.catar = function(req, res) {

	models.Quiz.findAll().then(function(quizes) {
		models.Comment.findAll().then(function(comments){
			var preguntas = 0, comentarios = 0, media = 0, sin = 0, con = 0;

			// preguntas
			preguntas = quizes.length;

			//comentarios
			comentarios = comments.length;

			//media
			if (preguntas === 0){
				media = "no";
			}
			else {media = comentarios/preguntas;}

			//con
			var ids = [];

			for (index in comments) {
				if (ids.indexOf(comments[index].QuizId) === -1)
					ids.push(comments[index].QuizId);
			}

			con = ids.length;

			//sin
			sin = preguntas - con;

			res.render('quizes/statistics', {preguntas: preguntas, comentarios: comentarios, media: media, sin: sin, con: con, errors: []});
		})
	}
)};

exports.load = function(req, res, next) {





	models.Quiz.findAll({
		include: [{ model: models.Comment}]
	}).then(function(quiz) {
		next();
	}).catch(function(error) {next(error)});
};