const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	userID: {
		type: String,
		required: true
	},
	answers: [
		{
			questionID: {
				type: String,
			},
			answer: {
				type: String,
			}
		}
	],
	questions: [
		{
			questionID: {
				type: String,
			}
		}
	],
});

UserSchema.pre('save', function(next){
	var user = this;
	if(user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
}); 

var User = mongoose.model('User', UserSchema);

module.exports = {
	User
};