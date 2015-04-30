var models = require('../models/models.js');

//GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', { quizes: quizes});
	})
};

// GET /quizes/:id
exports.question = function(req, res) {
	res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {

	if (req.query.respuesta === 'Roma') {
		res.render('quizes/answer', {respuesta: 'Correcto'});
	}
	else {
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}
};