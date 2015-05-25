var express = require('express');
var router = express.Router();
var multer = require('multer');

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');
var userController = require('../controllers/user_controller');
var favouritesController = require('../controllers/favourites_controller');

/* GET home page. */
router.get('/', function(req, res) {
	if (req.session.user) {
		var d = new Date();
		var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
		req.session.user.hora = hora;
	}
	res.render('index', { title: 'Quiz', errors: []});
});


router.param('quizId', quizController.load);
router.param('commentId', commentController.load);
router.param('userId',  userController.load);

router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

router.get('/user', userController.new);
router.post('/user', userController.create);
router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired, userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.update);
router.delete('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
router.get('/user/:userId(\\d+)/quizes', quizController.index);

router.get('/quizes/statistics', statisticsController.catar);

router.get('/quizes', quizController.index);
router.get('/quizes/user/:userId(\\d+)', sessionController.loginRequired, quizController.index);
router.get('/quizes/user/:userId(\\d+)/:quizId(\\d+)', sessionController.loginRequired, quizController.show);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new', 	sessionController.loginRequired, quizController.new);
router.post('/quizes/:userId(\\d+)/create', sessionController.loginRequired, multer({dest: './public/media/'}), quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.ownershipRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, multer({dest: './public/media/'}), quizController.ownershipRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);

//favoritos
router.put('/user/:userId/favourites/:quizId', sessionController.loginRequired, favouritesController.favoritear);
router.delete('/user/:userId/favourites/:quizId', sessionController.loginRequired, favouritesController.desfavoritear);
router.get('/user/:userId/favourites', sessionController.loginRequired, favouritesController.mostrar);

router.get('/author', function(req, res){
	if (req.session.user) {
			var d = new Date();
			var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
			req.session.user.hora = hora;
	}
	res.render('author', {errors: []});
});

module.exports = router;