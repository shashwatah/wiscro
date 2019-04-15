const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wiscro', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true,
	socketTimeoutMS: 30000,
	keepAlive: true,
	reconnectTries: 30000
});

module.exports = {
	mongoose: mongoose
};