exports.loginRequired = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

exports.new = function (req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

exports.create = function(req, res) {

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {

		if (error) {
			req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
			res.redirect("/login");
			return;
		}
		var d = new Date();
		var hora = d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
		req.session.user = {id:user.id, username:user.username, hora:hora, isAdmin:user.isAdmin};

		res.redirect('/');
	});
};

exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect('/'); //req.session.redir.toString()
};