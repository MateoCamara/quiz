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
	})

	if (req.session.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;
	}
};