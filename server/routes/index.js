
const service = {};
service.routes = routes;
module.exports = service;

function routes(app) {
	app.use('/api', require('../controllers/user.controller.js'));
}
