var models = require('../models/models.js');

exports.catar = function(req, res) {

	models.Quiz.findAll().then(function(quizes) {
		var preguntas = 0, comentarios = 0, media = 0, sin = 0, con = 0;

		// preguntas
		preguntas = quizes.length;

		//comentarios
		comentarios = quizes[0].Comment;

		//media
		if (preguntas === 0){
			media = "no";
		}
		else {media = comentarios/preguntas;}

		//sin


		//con
		con = preguntas - sin;

		res.render('quizes/statistics', {preguntas: preguntas, comentarios: comentarios, media: media, sin: sin, con: con, errors: []});
	}
)};

exports.load = function(req, res, next) {





	models.Quiz.findAll({
		include: [{ model: models.Comment}]
	}).then(function(quiz) {
		next();
	}).catch(function(error) {next(error)});
};